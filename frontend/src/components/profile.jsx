import React, { useState, useEffect } from "react";
import "../css_styling/profile.css";


function Profile({ isOpen, onClose }) {
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    name: "",
    institution: "",
    hostel: "",
    year: ""
  });

  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [newProfile, setNewProfile] = useState({
    Name: "",
    Institute: "",
    Hostle: "",
    Passing_Year: ""
  });

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://127.0.0.1:8000/profile/all", {
          headers: { Authorization: `Bearer ${token}` }
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
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
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
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewProfileChange = (e) => {
    setNewProfile({ ...newProfile, [e.target.name]: e.target.value });
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
      if (!res.ok) throw new Error(data.detail);

      alert("Profile created successfully");
      setShowCreateProfile(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUploadChange = (e) => {
    setUploadData({ ...uploadData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setUploadData({ ...uploadData, file: e.target.files[0] });
  };

  const handleUploadSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      Object.entries(uploadData).forEach(([k, v]) =>
        formData.append(k, v)
      );

      await fetch("http://127.0.0.1:8000/profile/your_lost_item", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      alert("Upload successful");
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        className={`profile-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      ></div>

      {/* PANEL */}
      <div className={`profile-panel ${isOpen ? "open" : ""}`}>

        <div className="profile-header">
          <h2>My Profile</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="profile-content">

          {/* ORIGINAL UI (UNCHANGED LOGIC) */}
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

          {showCreateProfile && (
            <div>
              <input name="Name" placeholder="Name" onChange={handleNewProfileChange} />
              <input name="Institute" placeholder="Institute" onChange={handleNewProfileChange} />
              <input name="Hostle" placeholder="Hostel" onChange={handleNewProfileChange} />
              <input name="Passing_Year" placeholder="Passing Year" onChange={handleNewProfileChange} />
              <button onClick={handleCreateProfile}>Submit Profile</button>
            </div>
          )}

          <button onClick={() => setShowForm(!showForm)}>
            Upload Lost Item
          </button>

          {showForm && (
            <div>
              <input name="title" placeholder="Title" onChange={handleUploadChange} />
              <input name="category" placeholder="Category" onChange={handleUploadChange} />
              <input name="description" placeholder="Description" onChange={handleUploadChange} />
              <input name="last_seen_location" placeholder="Location" onChange={handleUploadChange} />
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
      </div>
    </>
  );
}

export default Profile;