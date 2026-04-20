import React, { useState } from "react";

function MyLostItemCard({
  id,
  image,
  title,
  category,
  status,
  description,
  location,
  onDeleteSuccess,
  onEditSuccess
}) {

  // 🔥 NEW: toggle + form state
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState({
    title: title,
    category: category,
    status: status,
    description: description,
    location: location
  });

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("Deleting ID:", id);
      console.log("Token:", token);

      if (!token) {
        alert("Login required");
        return;
      }

      const res = await fetch(
        `http://127.0.0.1:8000/items/your_lost_items/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail);

      if (onDeleteSuccess) onDeleteSuccess(id);

    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  // 🔥 UPDATED: now uses FormData (backend expects Form)
  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Login required");
        return;
      }

      const formData = new FormData();
      formData.append("title", editData.title);
      formData.append("category", editData.category);
      formData.append("status", editData.status);
      formData.append("description", editData.description);
      formData.append("location", editData.location);

      const res = await fetch(
        `http://127.0.0.1:8000/items/your_lost_items/update/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`   // ❗ no Content-Type
          },
          body: formData
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail);

      if (onEditSuccess) onEditSuccess(id, editData);

      setShowEditForm(false);

    } catch (err) {
      console.error("EDIT ERROR:", err);
    }
  };

  // 🔥 NEW: handle input change
  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <h3>{title}</h3>
      <img src={image} alt={title} />
      <p>{category}</p>
      <p>{status}</p>
      <p>{location}</p>
      <p>{description}</p>

      <button onClick={() => setShowEditForm(!showEditForm)}>
        Edit
      </button>
      <button onClick={handleDelete}>Delete</button>

      {/* 🔥 NEW EDIT FORM */}
      {showEditForm && (
        <div>
          <input
            name="title"
            value={editData.title}
            onChange={handleChange}
            placeholder="Title"
          />

          <input
            name="category"
            value={editData.category}
            onChange={handleChange}
            placeholder="Category"
          />

          <select
            name="status"
            value={editData.status}
            onChange={handleChange}
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <input
            name="location"
            value={editData.location}
            onChange={handleChange}
            placeholder="Location"
          />

          <input
            name="description"
            value={editData.description}
            onChange={handleChange}
            placeholder="Description"
          />

          <button onClick={handleEdit}>Save</button>
        </div>
      )}
    </>
  );
}

export default MyLostItemCard;