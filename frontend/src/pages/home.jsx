import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LostItemCard from "../components/item";
import MyLostItemCard from "../components/mylostitem";
import "../css_styling/home.css";

function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [view, setView] = useState("all");

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/items/")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  }, []);

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

      Object.entries(uploadData).forEach(([key, value]) => {
        formData.append(key, value);
      });

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
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/registration";
  };

  return (
    <div className="home-container">

      {/* HEADER */}
      <div className="home-header">
        <h1>Lost & Found</h1>
        <button className="btn-black" onClick={handleLogout}>Logout</button>
      </div>

      {/* SEARCH */}
      <input
        className="search-bar"
        type="text"
        placeholder="Search lost items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TOGGLE */}
      <div className="toggle">
        <button
          className={view === "all" ? "active" : ""}
          onClick={() => setView("all")}
        >
          All Items
        </button>
        <button
          className={view === "mine" ? "active" : ""}
          onClick={() => setView("mine")}
        >
          My Items
        </button>
      </div>

      {/* CATEGORY */}
      <div className="categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ITEMS */}
      <div className="items-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) =>
            view === "mine" ? (
              <MyLostItemCard key={item._id} {...item} />
            ) : (
              <LostItemCard key={item._id} {...item} />
            )
          )
        ) : (
          <p>No items found</p>
        )}
      </div>

      {/* FLOAT BUTTON */}
      {view === "all" && (
        <button
          className="floating-btn"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          +
        </button>
      )}

      {/* UPLOAD FORM */}
      {showUploadForm && (
        <div className="upload-modal">
          <div className="upload-box">
            <h3>Upload Item</h3>

            <input name="title" placeholder="Title" onChange={handleUploadChange} />
            <input name="category" placeholder="Category" onChange={handleUploadChange} />
            <input name="description" placeholder="Description" onChange={handleUploadChange} />
            <input name="location" placeholder="Location" onChange={handleUploadChange} />

            <select name="status" onChange={handleUploadChange}>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>

            <input type="file" onChange={handleFileChange} />

            <button className="btn-primary" onClick={handleUpload}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;