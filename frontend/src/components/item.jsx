import React, { useState } from "react";
import "../css_styling/item.css";

function LostItemCard({
  id,
  image,
  title,
  category,
  description,
  status,
  last_seen_location,
  location,   //  added fallback
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const [formData, setFormData] = useState({
    title,
    category,
    description,
    status,
    location: last_seen_location || location,  //  FIX
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:8000/items/delete/${id}`, {   // fixed typo
        method: "DELETE",
      });
      alert("Deleted!");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("status", formData.status);
    data.append("last_seen_location", formData.location); // FIX

    try {
      await fetch(`http://localhost:8000/items/your_lost_items/update/${id}`, {
        method: "PUT",
        body: data,
      });
      alert("Updated!");
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  console.log("IMAGE URL:", image);

  return (
    <div className="lc-card">
      {/* ── Image ── */}
      <div className="lc-card__image-wrap">
        {!imgLoaded && (
          <div className="lc-card__image-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
        )}
        {image && (
          <img
            className={`lc-card__image${imgLoaded ? " loaded" : ""}`}
            src={image}
            alt={title}
            onLoad={() => setImgLoaded(true)}
          />
        )}
        <span className={`lc-card__status-badge lc-card__status-badge--${status === "found" ? "found" : "lost"}`}>
          {status === "found" ? "Found" : "Lost"}
        </span>
      </div>

      {/* ── View Mode ── */}
      {!isEditing && (
        <>
          <div className="lc-card__body">
            {category && <p className="lc-card__category">{category}</p>}
            <h3 className="lc-card__title">{title}</h3>

            {/* 🔥 LOCATION FIX */}
            {(last_seen_location || location) && (
              <p className="lc-card__meta">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                {last_seen_location || location}
              </p>
            )}

            {description && <p className="lc-card__description">{description}</p>}
          </div>

          <div className="lc-card__actions">
            <button className="lc-btn lc-btn--primary" onClick={() => setIsEditing(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </button>

            <button className="lc-btn lc-btn--danger" onClick={handleDelete}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
              Delete
            </button>
          </div>
        </>
      )}

      {/* ── Edit Mode ── */}
      {isEditing && (
        <div className="lc-edit-form">
          <p className="lc-edit-form__heading">Edit Item</p>

          <div className="lc-field">
            <label htmlFor={`title-${id}`}>Title</label>
            <input
              id={`title-${id}`}
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="lc-field">
            <label htmlFor={`category-${id}`}>Category</label>
            <input
              id={`category-${id}`}
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="lc-field">
            <label htmlFor={`location-${id}`}>Location</label>
            <input
              id={`location-${id}`}
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="lc-field">
            <label htmlFor={`desc-${id}`}>Description</label>
            <textarea
              id={`desc-${id}`}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="lc-field">
            <label htmlFor={`status-${id}`}>Status</label>
            <select
              id={`status-${id}`}
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div className="lc-edit-form__actions">
            <button className="lc-btn lc-btn--cancel" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button className="lc-btn lc-btn--save" onClick={handleUpdate}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LostItemCard;