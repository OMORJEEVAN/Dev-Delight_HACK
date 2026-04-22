import React, { useState, useEffect } from "react";
import "../css_styling/mylostitem.css";

function MyLostItemCard({
  id, //THIS MUST BE Mongo _id string
  image,
  title,
  category,
  status,
  description,
  location,
  onDeleteSuccess,
  onEditSuccess,
}) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [aiMatches, setAiMatches] = useState([]); // NEW

  const [editData, setEditData] = useState({
    title,
    category,
    status,
    description,
    location,
  });

  //FETCH AI RECOMMENDATIONS
  useEffect(() => {
    const fetchAI = async () => {
      try {
        if (!id) return;

        const res = await fetch(
          `http://127.0.0.1:8000/recommendations/${id}`
        );

        const data = await res.json();

        // only store recommendations
        setAiMatches(data.recommendations || []);
      } catch (err) {
        console.error("AI FETCH ERROR:", err);
      }
    };

    fetchAI();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { alert("Login required"); return; }

      const res = await fetch(
        `http://127.0.0.1:8000/items/your_lost_items/delete/${id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      if (onDeleteSuccess) onDeleteSuccess(id);
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { alert("Login required"); return; }

      const formData = new FormData();
      Object.entries(editData).forEach(([k, v]) => formData.append(k, v));

      const res = await fetch(
        `http://127.0.0.1:8000/items/your_lost_items/update/${id}`,
        { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: formData }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      if (onEditSuccess) onEditSuccess(id, editData);
      setShowEditForm(false);
    } catch (err) {
      console.error("EDIT ERROR:", err);
    }
  };

  const handleChange = (e) =>
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="sbx-card">
      {/* Image */}
      <div className="sbx-card__image-wrap">
        {!imgLoaded && (
          <div className="sbx-card__image-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
        )}
        {image && (
          <img
            className={`sbx-card__image${imgLoaded ? " loaded" : ""}`}
            src={image}
            alt={title}
            onLoad={() => setImgLoaded(true)}
          />
        )}
        <span className={`sbx-card__status-badge sbx-card__status-badge--${status === "found" ? "found" : "lost"}`}>
          {status === "found" ? "Found" : "Lost"}
        </span>
      </div>

      {/* Body */}
      <div className="sbx-card__body">
        {category && <p className="sbx-card__category">{category}</p>}
        <h3 className="sbx-card__title">{title}</h3>

        {location && (
          <p className="sbx-card__meta">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            {location}
          </p>
        )}

        {description && <p className="sbx-card__description">{description}</p>}

        {/* AI MATCHES (NO DESIGN CHANGE) */}
        {aiMatches.length > 0 && (
          <p className="sbx-card__description">
            <strong>AI Matches:</strong><br />
            {aiMatches.map((rec, i) => (
              <span key={i}>
                {rec.item.title} ({(rec.score * 100).toFixed(0)}%)<br />
              </span>
            ))}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="sbx-card__actions">
        <button
          className="sbx-btn sbx-btn--primary"
          onClick={() => setShowEditForm((v) => !v)}
        >
          {showEditForm ? "Cancel" : "Edit"}
        </button>

        <button className="sbx-btn sbx-btn--danger" onClick={handleDelete}>
          Delete
        </button>
      </div>

      {/* Edit Form */}
      {showEditForm && (
        <div className="sbx-edit-form">
          <p className="sbx-edit-form__title">Edit Item</p>

          <div className="sbx-field">
            <label>Title</label>
            <input name="title" value={editData.title} onChange={handleChange}/>
          </div>

          <div className="sbx-field">
            <label>Category</label>
            <input name="category" value={editData.category} onChange={handleChange}/>
          </div>

          <div className="sbx-field">
            <label>Status</label>
            <select name="status" value={editData.status} onChange={handleChange}>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div className="sbx-field">
            <label>Location</label>
            <input name="location" value={editData.location} onChange={handleChange}/>
          </div>

          <div className="sbx-field">
            <label>Description</label>
            <textarea name="description" value={editData.description} onChange={handleChange}/>
          </div>

          <div className="sbx-edit-form__actions">
            <button className="sbx-btn sbx-btn--cancel" onClick={() => setShowEditForm(false)}>
              Cancel
            </button>
            <button className="sbx-btn sbx-btn--save" onClick={handleEdit}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyLostItemCard;