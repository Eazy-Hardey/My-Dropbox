// src/components/Navbar.js

import React from "react";
import { auth } from "../firebase";
import "./Navbar.css";

const Navbar = () => {
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <nav className="navbar">
      <h1>Dropbox Clone</h1>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
