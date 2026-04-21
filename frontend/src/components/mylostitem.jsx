import React, { useState } from "react";
import "../css_styling/mylostitem.css";

function MyLostItemCard({
  id,
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
  const [editData, setEditData] = useState({
    title,
    category,
    status,
    description,
    location,
  });

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
      </div>

      {/* Actions */}
      <div className="sbx-card__actions">
        <button
          className="sbx-btn sbx-btn--primary"
          onClick={() => setShowEditForm((v) => !v)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          {showEditForm ? "Cancel" : "Edit"}
        </button>
        <button className="sbx-btn sbx-btn--danger" onClick={handleDelete}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
          Delete
        </button>
      </div>

      {/* Edit Form */}
      {showEditForm && (
        <div className="sbx-edit-form">
          <p className="sbx-edit-form__title">Edit Item</p>

          <div className="sbx-field">
            <label htmlFor={`title-${id}`}>Title</label>
            <input
              id={`title-${id}`}
              name="title"
              value={editData.title}
              onChange={handleChange}
              placeholder="Item title"
            />
          </div>

          <div className="sbx-field">
            <label htmlFor={`category-${id}`}>Category</label>
            <input
              id={`category-${id}`}
              name="category"
              value={editData.category}
              onChange={handleChange}
              placeholder="e.g. Electronics, Clothing"
            />
          </div>

          <div className="sbx-field">
            <label htmlFor={`status-${id}`}>Status</label>
            <div className="sbx-select-wrap">
              <select
                id={`status-${id}`}
                name="status"
                value={editData.status}
                onChange={handleChange}
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
          </div>

          <div className="sbx-field">
            <label htmlFor={`location-${id}`}>Location</label>
            <input
              id={`location-${id}`}
              name="location"
              value={editData.location}
              onChange={handleChange}
              placeholder="Where was it lost/found?"
            />
          </div>

          <div className="sbx-field">
            <label htmlFor={`desc-${id}`}>Description</label>
            <textarea
              id={`desc-${id}`}
              name="description"
              value={editData.description}
              onChange={handleChange}
              placeholder="Add a description..."
            />
          </div>

          <div className="sbx-edit-form__actions">
            <button className="sbx-btn sbx-btn--cancel" onClick={() => setShowEditForm(false)}>
              Cancel
            </button>
            <button className="sbx-btn sbx-btn--save" onClick={handleEdit}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyLostItemCard;