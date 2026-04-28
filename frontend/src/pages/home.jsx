import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LostItemCard from "../components/item";
import MyLostItemCard from "../components/mylostitem";
import "../css_styling/home.css";
import heroImg from "../assets/navbar.svg";

const categories = [
  "All",
  "ID Cards",
  "Wallets",
  "Keys",
  "Electronics",
  "Mobile Phones",
  "Laptops",
  "Chargers",
  "Earphones",
  "Bags",
  "Garments",
  "Shoes",
  "Books",
  "Stationery",
  "Bicycle",
  "Umbrella",
  "Water Bottles",
  "Accessories",
  "Documents",
  "Others"
];

function Home({ view, setView }) {
  const navigate = useNavigate();

  const [search, setSearch]                   = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems]                     = useState([]);
  const [myItems, setMyItems]                 = useState([]);
  const [showUploadForm, setShowUploadForm]   = useState(false);
  const [uploadData, setUploadData]           = useState({
    title: "", category: "", description: "",
    location: "", status: "lost", file: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;   /*pagination*/

  /* ── Auth guard ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  /* ── All items ── */
  useEffect(() => {
    fetch("http://127.0.0.1:8000/items/")
      .then((r) => r.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  /* ── My items ── */
  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://127.0.0.1:8000/profile/your_lost_item/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMyItems(data);
      } catch (err) { console.error(err); }
    };
    fetchMyItems();
  }, []);

  /* ── Filtering ── */
  const normalize = (s) => s?.toLowerCase().replace(/\s+/g, "").trim();

  const activeItems = view === "all" ? items : myItems;

  const filteredItems = activeItems.filter((item) => {
    const matchesCat =
      selectedCategory === "All" ||
      normalize(item.category).includes(normalize(selectedCategory));
    const matchesSearch = `${item.title} ${item.description} ${item.category}`
      .toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });
  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  /* ── Upload handlers ── */
  const handleUploadChange = (e) =>
    setUploadData({ ...uploadData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setUploadData({ ...uploadData, file: e.target.files[0] });

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      Object.entries(uploadData).forEach(([k, v]) => formData.append(k, v));
      const res = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST", body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setItems((prev) => [data.data, ...prev]);
      setShowUploadForm(false);
    } catch (err) { console.error(err); }
  };
  return (
    <div className={`home-content ${view === "mine" ? "lost-mode" : ""}`}>

      {/* ── HERO BAND ── */}
      <div className={`home-hero ${view === "mine" ? "lost-mode" : ""}`}>
  
        <div className="home-hero-left">
          <p className="home-hero__eyebrow">Community Board</p>
          <h1 className="home-hero__heading">
            Find what's yours.<br/>Return what's theirs.
          </h1>
          <p className="home-hero__sub">
            Browse lost &amp; found items reported across campus.
          </p>
        </div>

        <div className="home-hero-right">
          <img src={heroImg} alt="illustration" />
        </div>

      </div>

      {/* ── SEARCH ── */}
      <div className="home-search-zone">
        <div className="home-search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className="home-search"
            type="text"
            placeholder="Search by title, category, description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── TOGGLE ── */}
      <div className="home-toggle-zone">
        
        <div className={`home-toggle ${view === "mine" ? "mine" : ""}`}>
          
          <button
            className={`home-toggle__btn${view === "all" ? " active" : ""}`}
            onClick={() => setView("all")}
          >
          Found Items
          </button>

          <button
            className={`home-toggle__btn${view === "mine" ? " active" : ""}`}
            onClick={() => setView("mine")}
          >
          Lost Reports
          </button>

        </div>

      <span className="home-count-badge">
        {filteredItems.length} results
      </span>

      </div>

      {/* ── CATEGORIES ── */}
      <div className="home-categories-zone">
        <div className="home-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`home-cat-btn${selectedCategory === cat ? " active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── SECTION LABEL ── */}
      <div className="home-section-label">
        <h2>{view === "all" ? "Items" : "Reports"}</h2>
        <span>{selectedCategory !== "All" && `· ${selectedCategory}`}</span>
      </div>

      {/* ── GRID ── */}
      <div className="home-grid-zone">
        <div className="home-grid">
          {filteredItems.length > 0 ? (
            currentItems.map((item) =>
              view === "mine" ? (
                <MyLostItemCard key={item._id} {...item} id={item._id} image={item.image_url} description={item.description} />
              ) : (
                <LostItemCard key={item._id}  {...item} id={item._id}  image={item.image_url} last_seen_location={item.location} />
              )
            )
          ) : (
            <div className="home-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
              <p>No items found</p>
              <small>Try adjusting your search or category filter</small>
            </div>
          )}
        </div>
      </div>

      {/* ── FLOATING ACTION BUTTON ── */}
      {view === "all" && (
        <button
          className="home-fab"
          onClick={() => setShowUploadForm(true)}
          title="Report a lost or found item"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      )}

      {/* ── UPLOAD MODAL ── */}
      {showUploadForm && (
        <div className="home-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowUploadForm(false)}>
          <div className="home-modal">

            <div className="home-modal__header">
              <h3>Report an Item</h3>
              <button className="home-modal__close" onClick={() => setShowUploadForm(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="home-modal__body">
              <div className="home-modal-field">
                <label>Title</label>
                <input name="title" placeholder="e.g. Blue Water Bottle" onChange={handleUploadChange} />
              </div>

              <div className="home-modal-field">
                <label>Category</label>
                <input name="category" placeholder="e.g. Electronics, Garments" onChange={handleUploadChange} />
              </div>

              <div className="home-modal-field">
                <label>Location</label>
                <input name="location" placeholder="Where was it lost or found?" onChange={handleUploadChange} />
              </div>

              <div className="home-modal-field">
                <label>Description</label>
                <textarea name="description" placeholder="Any distinguishing features…" onChange={handleUploadChange} />
              </div>

              <div className="home-modal-field">
                <label>Status</label>
                <div className="home-modal-select-wrap">
                  <select name="status" onChange={handleUploadChange}>
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>
              </div>

              <div className="home-modal-field">
                <label>Photo</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>

            <div className="home-modal__footer">
              <button className="home-btn home-btn--ghost" onClick={() => setShowUploadForm(false)}>
                Cancel
              </button>
              <button className="home-btn home-btn--submit" onClick={handleUpload}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Submit Report
              </button>
            </div>

          </div>
        </div>
      )}
      {/* ── PAGINATION ── */}
        <div className={`home-pagination ${view === "mine" ? "lost-mode" : ""}`}>

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ◄
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            ▶
          </button>

        </div>
    </div>
  );
}

export default Home;