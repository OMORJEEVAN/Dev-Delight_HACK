import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css_styling/navbar.css";
import profileImg from "../assets/pp.png";
import Profile from "./profile"; // ✅ IMPORTANT

function Navbar() {
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

  return (
    <>
      <div className="navbar">

        <div className="nav-left">
          <h2 className="logo">Lost&Found</h2>
        </div>

        <div className="nav-right">
          <div className="profile-wrapper" ref={dropdownRef}>
            <button
              className="profile-btn"
              onClick={() => setOpen(!open)}
            >
              <div className="avatar-container">
                <img src={profileImg} alt="profile" className="avatar-img" />
                <span className="status-dot"></span>
              </div>

              <span className="profile-text">Profile</span>
            </button>

            {open && (
              <div className="dropdown">
                {/* ✅ CHANGED */}
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setShowProfile(true);
                    setOpen(false);
                  }}
                >
                   My Profile
                </div>

                <Link to="/">Home</Link>
                <Link to="/registration">Logout</Link>
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="navbar-fill"></div>

      {/* ✅ FLOATING PROFILE PANEL */}
      <Profile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
}

export default Navbar;