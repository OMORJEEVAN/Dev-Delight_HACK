import React, { useState } from "react";

function LostItemCard({
  id,
  image,
  title,
  category,
  description,
  status,
  last_seen_location,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title,
    category,
    description,
    status,
    location: last_seen_location,
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // DELETE
  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:8000/items/delet/${id}`, {
        method: "DELETE",
      });

      alert("Deleted!");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    const data = new FormData();

    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("status", formData.status);
    data.append("location", formData.location);

    try {
      await fetch(`http://localhost:8000/items/update/${id}`, {
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

  return (
    <div>
      {!isEditing && (
        <>
          <h3>{title}</h3>
          <img src={image} alt={title} width="200" />
          <p><b>Category:</b> {category}</p>
          <p><b>Status:</b> {status}</p>
          <p><b>Description:</b> {description}</p>
          <p><b>Location:</b> {last_seen_location}</p>

          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}

      {isEditing && (
        <div>
          <h4>Edit Item</h4>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <br />

          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
          <br />

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
          <br />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <br />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <br />

          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default LostItemCard;