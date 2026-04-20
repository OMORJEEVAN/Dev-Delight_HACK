import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LostItemCard from "../components/item";
import MyLostItemCard from "../components/mylostitem";

function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [view, setView] = useState("all");

  // 🔥 NEW: Upload form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    status: "lost",
    file: null
  });

  const categories = [
    "All",
    "Electronics",
    "Stationary",
    "Garments",
    "ID Cards",
    "Shoes",
    "bicycle",
    "Books",
  ];

  // 🔒 AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // 🔹 FETCH ALL ITEMS
  useEffect(() => {
    fetch("http://127.0.0.1:8000/items/")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  }, []);

  // 🔹 FETCH MY ITEMS
  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          "http://127.0.0.1:8000/profile/your_lost_item/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setMyItems(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMyItems();
  }, []);

  // 🔹 FILTER
  const normalize = (str) =>
    str?.toLowerCase().replace(/\s+/g, "").trim();

  const activeItems = view === "all" ? items : myItems;

  const filteredItems = activeItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" ||
      normalize(item.category).includes(normalize(selectedCategory));

    const matchesSearch = `${item.title} ${item.description} ${item.category}`
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // 🔥 Upload handlers
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

  const handleUpload = async () => {
    try {
      const formData = new FormData();

      formData.append("title", uploadData.title);
      formData.append("category", uploadData.category);
      formData.append("description", uploadData.description);
      formData.append("status", uploadData.status);
      formData.append("location", uploadData.location);
      formData.append("file", uploadData.file);

      const res = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail);

      alert("Upload successful 🚀");

      setItems((prev) => [data.data, ...prev]);
      setShowUploadForm(false);

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
    }
  };

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/registration";
  };

  const handleDeleteSuccess = (id) => {
    setMyItems((prev) => prev.filter((item) => item._id !== id));
  };

  const handleEditSuccess = (id, updatedData) => {
    setMyItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, ...updatedData } : item
      )
    );
  };

  return (
    <div>
      <div className="logout-btn">
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h2>Home</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search lost items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🔥 Toggle */}
      <div>
        <button onClick={() => setView("all")}>All Items</button>
        <button onClick={() => setView("mine")}>My Items</button>
      </div>

      {/* 📂 Categories */}
      <div>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* 📦 Items */}
      <div>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) =>
            view === "mine" ? (
              <MyLostItemCard
                key={item._id}
                id={item._id}
                image={item.image_url}
                title={item.title}
                category={item.category}
                status={item.status}
                location={item.location}
                description={item.description}
                onDeleteSuccess={handleDeleteSuccess}
                onEditSuccess={handleEditSuccess}
              />
            ) : (
              <LostItemCard
                key={item._id}
                id={item._id}
                image={item.image_url}
                title={item.title}
                category={item.category}
                status={item.status}
                location={item.location}
                description={item.description}
              />
            )
          )
        ) : (
          <p>No items found</p>
        )}
      </div>

      {/* 🔥 Upload Button */}
      {view === "all" && (
        <div>
          <button onClick={() => setShowUploadForm(!showUploadForm)}>
            Upload Lost Item
          </button>
        </div>
      )}

      {/* 🔥 Upload Form */}
      {showUploadForm && (
        <div>
          <input name="title" placeholder="Title" onChange={handleUploadChange} />
          <input name="category" placeholder="Category" onChange={handleUploadChange} />
          <input name="description" placeholder="Description" onChange={handleUploadChange} />

          <select name="status" onChange={handleUploadChange}>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <input name="location" placeholder="Location" onChange={handleUploadChange} />

          <input type="file" onChange={handleFileChange} />

          <button onClick={handleUpload}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default Home;