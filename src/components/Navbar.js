// src/components/Navbar.js

import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { auth } from "../firebase";
import "./Navbar.css";

const Navbar = () => {
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <nav className="navbar">
      <h1>Dropbox Clone</h1>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
