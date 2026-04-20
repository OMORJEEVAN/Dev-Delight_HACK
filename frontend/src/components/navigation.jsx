import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css_styling/navbar.css";
import profileImg from "../assets/pp.png";

function Navbar() {
  const [open, setOpen] = useState(false);

  // 🔥 reference to dropdown area
  const dropdownRef = useRef();

  // 🔥 detect outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false); // close dropdown
      }
    }

    // add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
              <img
                src={profileImg}
                alt="profile"
                className="avatar-img"
              />
              <span className="status-dot"></span>
            </div>

            <span className="profile-text">Profile</span>
          </button>

          {open && (
            <div className="dropdown">
              <Link to="/profile">My Profile</Link>
              <Link to="/">Home</Link>
              <Link to="/registration">Logout</Link>
            </div>
          )}
        </div>
      </div>

    </div>

    {/* 🔥 NEW BLACK EXTENSION */}
    <div className="navbar-fill"></div>
  </>
);
}

export default Navbar;