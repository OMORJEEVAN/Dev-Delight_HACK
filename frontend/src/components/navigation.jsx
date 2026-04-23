import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css_styling/navbar.css";
import profileImg from "../assets/pp.png";
import Profile from "./profile";

function Navbar({ view }) {   //  ONLY CHANGE: accept view as prop
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  console.log("Navbar view:", view);

  return (
    <>
      {/* ✅ ONLY CHANGE: dynamic class */}
      <div className={`navbar ${view === "mine" ? "navbar--lost" : "navbar--found"}`}>

        {/* ── BRAND ── */}
        <div className="nav-left">
          <div className="nav-logo-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <div>
            <h2 className="logo">Lost&amp;Found</h2>
            <span className="logo-sub">Campus Network</span>
          </div>
        </div>

        {/* ── PROFILE ── */}
        <div className="nav-right">
          <div className="profile-wrapper" ref={dropdownRef}>

            <button className="profile-btn" onClick={() => setOpen(!open)}>
              <div className="avatar-container">
                <img src={profileImg} alt="profile" className="avatar-img" />
                <span className="status-dot" />
              </div>
              <span className="profile-text">Profile</span>
              <span className={`arrow${open ? " open" : ""}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </span>
            </button>

            {open && (
              <div className="dropdown">
                <span className="dropdown-section-label">Account</span>

                {/* My Profile */}
                <div
                  className="dropdown-item"
                  onClick={() => {
                      const token = localStorage.getItem("token");

                      if (!token) {
                        navigate("/registration");
                        return;
                      }

                      setShowProfile(true);
                      setOpen(false);
                    }}
                >
                  <span className="dropdown-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  My Profile
                </div>

                {/* Home */}
                <Link to="/" onClick={() => setOpen(false)} className="dropdown-item" style={{ textDecoration: "none" }}>
                  <span className="dropdown-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </span>
                  Home
                </Link>

                <div className="dropdown-divider" />

                {/* Logout */}
                <Link to="/registration" onClick={() => setOpen(false)} className="dropdown-item dropdown-item--logout" style={{ textDecoration: "none" }}>
                  <span className="dropdown-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                  </span>
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="navbar-fill" />

      <Profile isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
}

export default Navbar;