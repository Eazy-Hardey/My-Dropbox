// src/components/Authenticator.js

import React, { useState } from "react";
import { auth } from "../firebase";
import "./Authenticator.css";
import { toast } from "react-toastify";

const Authenticator = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login
        await auth.signInWithEmailAndPassword(email, password);
        toast.success("Logged in successfully!");
      } else {
        // Signup
        await auth.createUserWithEmailAndPassword(email, password);
        toast.success("Account created successfully!");
      }
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Authentication Error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      <p>
        {isLogin
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <span
          className="toggle-auth"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Sign Up" : "Login"}
        </span>
      </p>
    </div>
  );
};

export default Authenticator;
