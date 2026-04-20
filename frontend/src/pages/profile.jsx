import React, { useState, useEffect } from "react";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    name: "",
    institution: "",
    hostel: "",
    year: ""
  });

  // 🔥 NEW: create profile state
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [newProfile, setNewProfile] = useState({
    Name: "",
    Institute: "",
    Hostle: "",
    Passing_Year: ""
  });

  // 🔥 NEW: upload form toggle + data
  const [showForm, setShowForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    category: "",
    description: "",
    status: "lost",
    last_seen_location: "",
    owner_contact_number: "",
    file: null
  });

  // 🔥 Fetch profile from backend (✅ FIXED)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No token found");
          return;
        }

        const res = await fetch("http://127.0.0.1:8000/profile/all", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (data.length > 0) {
          const profile = data[0];

          setUser({
            name: profile.Name,
            institution: profile.Institute,
            hostel: profile.Hostle,
            year: profile.Passing_Year
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("Name", user.name);
      formData.append("Institute", user.institution);
      formData.append("Hostle", user.hostel);
      formData.append("Passing_Year", user.year);

      await fetch("http://127.0.0.1:8000/profile/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // 🔥 NEW create handlers
  const handleNewProfileChange = (e) => {
    setNewProfile({
      ...newProfile,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:8000/profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newProfile)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to create profile");
      }

      alert("Profile created successfully");
      setShowCreateProfile(false);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // 🔥 handle form change
  const handleUploadChange = (e) => {
    setUploadData({
      ...uploadData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setUploadData({
      ...uploadData,
      file: e.target.files[0]
    });
  };

  // 🔥 submit upload
  const handleUploadSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", uploadData.title);
      formData.append("category", uploadData.category);
      formData.append("description", uploadData.description);
      formData.append("status", uploadData.status);
      formData.append("last_seen_location", uploadData.last_seen_location);
      formData.append("owner_contact_number", uploadData.owner_contact_number);
      formData.append("file", uploadData.file);

      const res = await fetch("http://127.0.0.1:8000/profile/your_lost_item", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      console.log(data);

      alert("Upload successful");

      setShowForm(false);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div>
      <h2>My Profile</h2>

      <div>
        <label>Name:</label>
        {isEditing ? (
          <input name="name" value={user.name} onChange={handleChange} />
        ) : (
          <p>{user.name}</p>
        )}
      </div>

      <div>
        <label>Institution:</label>
        {isEditing ? (
          <input name="institution" value={user.institution} onChange={handleChange} />
        ) : (
          <p>{user.institution}</p>
        )}
      </div>

      <div>
        <label>Hostel:</label>
        {isEditing ? (
          <input name="hostel" value={user.hostel} onChange={handleChange} />
        ) : (
          <p>{user.hostel}</p>
        )}
      </div>

      <div>
        <label>Year:</label>
        {isEditing ? (
          <input name="year" value={user.year} onChange={handleChange} />
        ) : (
          <p>{user.year}</p>
        )}
      </div>

      <div>
        {isEditing ? (
          <button onClick={handleSave}>Save</button>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => setShowCreateProfile(!showCreateProfile)}>
              Add Profile
            </button>
          </>
        )}
      </div>

      {/* 🔥 NEW CREATE PROFILE FORM */}
      {showCreateProfile && (
        <div>
          <input name="Name" placeholder="Name" onChange={handleNewProfileChange} />
          <input name="Institute" placeholder="Institute" onChange={handleNewProfileChange} />
          <input name="Hostle" placeholder="Hostel" onChange={handleNewProfileChange} />
          <input name="Passing_Year" placeholder="Passing Year" onChange={handleNewProfileChange} />

          <button onClick={handleCreateProfile}>Submit Profile</button>
        </div>
      )}

      <div className="my lost items">
        <button onClick={() => setShowForm(!showForm)}>
          Upload Lost Item
        </button>
      </div>

      {showForm && (
        <div>
          <input name="title" placeholder="Title" onChange={handleUploadChange} />
          <input name="category" placeholder="Category" onChange={handleUploadChange} />
          <input name="description" placeholder="Description" onChange={handleUploadChange} />
          <input name="last_seen_location" placeholder="Last Seen Location" onChange={handleUploadChange} />
          <input name="owner_contact_number" placeholder="Contact Number" onChange={handleUploadChange} />

          <select name="status" onChange={handleUploadChange}>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          <input type="file" onChange={handleFileChange} />

          <button onClick={handleUploadSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default Profile;