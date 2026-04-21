import React, { useState, useEffect } from "react";
import "../css_styling/profile.css";

function Profile({ isOpen, onClose }) {
  const [isEditing, setIsEditing]               = useState(false);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [showForm, setShowForm]                 = useState(false);

  const [user, setUser] = useState({
    name: "", institution: "", hostel: "", year: "",
  });

  const [newProfile, setNewProfile] = useState({
    Name: "", Institute: "", Hostle: "", Passing_Year: "",
  });

  const [uploadData, setUploadData] = useState({
    title: "", category: "", description: "",
    status: "lost", last_seen_location: "",
    owner_contact_number: "", file: null,
  });

  /* ── fetch profile ── */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res  = await fetch("http://127.0.0.1:8000/profile/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.length > 0) {
          const p = data[0];
          setUser({ name: p.Name, institution: p.Institute, hostel: p.Hostle, year: p.Passing_Year });
        }
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, []);

  /* ── handlers ── */
  const handleChange    = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  const handleNPChange  = (e) => setNewProfile({ ...newProfile, [e.target.name]: e.target.value });
  const handleUDChange  = (e) => setUploadData({ ...uploadData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setUploadData({ ...uploadData, file: e.target.files[0] });

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
        body: formData,
      });
      setIsEditing(false);
    } catch (err) { console.error(err); }
  };

  const handleCreateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch("http://127.0.0.1:8000/profile/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newProfile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      alert("Profile created successfully");
      setShowCreateProfile(false);
    } catch (err) { alert(err.message); }
  };

  const handleUploadSubmit = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const formData = new FormData();
    Object.entries(uploadData).forEach(([k, v]) => formData.append(k, v));

    const res = await fetch("http://127.0.0.1:8000/profile/your_lost_item", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Upload failed");
    }

    alert("Upload successful");
    setShowForm(false);

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    alert(err.message);
  }
};

  const initials = user.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <>
      {/* OVERLAY */}
      <div className={`profile-overlay${isOpen ? " show" : ""}`} onClick={onClose} />

      {/* PANEL */}
      <div className={`profile-panel${isOpen ? " open" : ""}`}>

        {/* ── HEADER ── */}
        <div className="profile-header">
          <div className="profile-header__left">
            <p className="profile-header__eyebrow">Account</p>
            <h2 className="profile-header__title">My Profile</h2>
          </div>
          <button className="profile-header__close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="profile-content">

          {/* Avatar + name hero */}
          <div className="profile-card" style={{ alignItems: "center", textAlign: "center", padding: "24px 20px" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "#1E3932", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em",
              marginBottom: 10, flexShrink: 0,
            }}>
              {initials}
            </div>
            <p style={{ fontSize: 17, fontWeight: 800, color: "rgba(0,0,0,0.87)", margin: "0 0 2px" }}>
              {user.name || "—"}
            </p>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.50)", margin: 0 }}>
              {user.institution || "No institution set"}
            </p>
          </div>

          {/* ── INFO CARD ── */}
          <div className="profile-card">
            <p className="profile-card__title">Profile Info</p>

            {/* Name */}
            <div className="profile-field">
              <span className="profile-field__label">Name</span>
              {isEditing
                ? <input className="profile-input" name="name" value={user.name} onChange={handleChange} placeholder="Your full name" />
                : <p className={`profile-field__value${!user.name ? " profile-field__value--empty" : ""}`}>{user.name || "Not set"}</p>
              }
            </div>

            {/* Institution */}
            <div className="profile-field">
              <span className="profile-field__label">Institution</span>
              {isEditing
                ? <input className="profile-input" name="institution" value={user.institution} onChange={handleChange} placeholder="Your institution" />
                : <p className={`profile-field__value${!user.institution ? " profile-field__value--empty" : ""}`}>{user.institution || "Not set"}</p>
              }
            </div>

            {/* Hostel */}
            <div className="profile-field">
              <span className="profile-field__label">Hostel</span>
              {isEditing
                ? <input className="profile-input" name="hostel" value={user.hostel} onChange={handleChange} placeholder="Your hostel" />
                : <p className={`profile-field__value${!user.hostel ? " profile-field__value--empty" : ""}`}>{user.hostel || "Not set"}</p>
              }
            </div>

            {/* Year */}
            <div className="profile-field">
              <span className="profile-field__label">Passing Year</span>
              {isEditing
                ? <input className="profile-input" name="year" value={user.year} onChange={handleChange} placeholder="e.g. 2026" />
                : <p className={`profile-field__value${!user.year ? " profile-field__value--empty" : ""}`}>{user.year || "Not set"}</p>
              }
            </div>

            <div className="profile-divider" />

            {/* Edit / Save buttons */}
            {isEditing ? (
              <div className="profile-btn-row">
                <button className="profile-btn profile-btn--ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button className="profile-btn profile-btn--primary" onClick={handleSave}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="profile-btn-row">
                <button className="profile-btn profile-btn--secondary" onClick={() => setIsEditing(true)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit Profile
                </button>
                <button className="profile-btn profile-btn--ghost" onClick={() => setShowCreateProfile(!showCreateProfile)}>
                  + Add Profile
                </button>
              </div>
            )}
          </div>

          {/* ── CREATE PROFILE FORM ── */}
          {showCreateProfile && (
            <div className="profile-form-section">
              <div className="profile-form-section__header">
                <h4>Create New Profile</h4>
              </div>
              <div className="profile-form-section__body">
                {[
                  { name: "Name",         placeholder: "Full name" },
                  { name: "Institute",    placeholder: "Institution" },
                  { name: "Hostle",       placeholder: "Hostel" },
                  { name: "Passing_Year", placeholder: "Passing year e.g. 2026" },
                ].map((f) => (
                  <div className="profile-form-field" key={f.name}>
                    <label>{f.name.replace("_", " ")}</label>
                    <input name={f.name} placeholder={f.placeholder} onChange={handleNPChange} />
                  </div>
                ))}
                <div className="profile-btn-row">
                  <button className="profile-btn profile-btn--ghost" onClick={() => setShowCreateProfile(false)}>Cancel</button>
                  <button className="profile-btn profile-btn--primary" onClick={handleCreateProfile}>Submit Profile</button>
                </div>
              </div>
            </div>
          )}

          {/* ── UPLOAD LOST ITEM TOGGLE ── */}
          <button
            className={`profile-btn profile-btn--full${showForm ? " profile-btn--ghost" : " profile-btn--primary"}`}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Cancel Upload
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Upload Lost Item
              </>
            )}
          </button>

          {/* ── UPLOAD FORM ── */}
          {showForm && (
            <div className="profile-form-section">
              <div className="profile-form-section__header">
                <h4>Report a Lost Item</h4>
              </div>
              <div className="profile-form-section__body">

                <div className="profile-form-field">
                  <label>Title</label>
                  <input name="title" placeholder="e.g. Blue Water Bottle" onChange={handleUDChange} />
                </div>

                <div className="profile-form-field">
                  <label>Category</label>
                  <input name="category" placeholder="e.g. Electronics, Garments" onChange={handleUDChange} />
                </div>

                <div className="profile-form-field">
                  <label>Location Last Seen</label>
                  <input name="last_seen_location" placeholder="Where was it last seen?" onChange={handleUDChange} />
                </div>

                <div className="profile-form-field">
                  <label>Contact Number</label>
                  <input name="owner_contact_number" placeholder="Your contact number" onChange={handleUDChange} />
                </div>

                <div className="profile-form-field">
                  <label>Description</label>
                  <textarea name="description" placeholder="Any distinguishing features…" onChange={handleUDChange} />
                </div>

                <div className="profile-form-field">
                  <label>Status</label>
                  <div className="profile-select-wrap">
                    <select name="status" onChange={handleUDChange}>
                      <option value="lost">Lost</option>
                      <option value="found">Found</option>
                    </select>
                  </div>
                </div>

                <div className="profile-form-field">
                  <label>Photo</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                <div className="profile-btn-row">
                  <button className="profile-btn profile-btn--ghost" onClick={() => setShowForm(false)}>Cancel</button>
                  <button className="profile-btn profile-btn--primary" onClick={handleUploadSubmit}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Submit Report
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>{/* end profile-content */}
      </div>{/* end profile-panel */}
    </>
  );
}

export default Profile;