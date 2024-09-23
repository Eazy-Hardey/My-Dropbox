// src/components/ProfilePage.js

import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";
import firebase from "firebase/compat/app";
import { toast } from "react-toastify";
import "./ProfilePage.css";

const ProfilePage = () => {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [email, setEmail] = useState(user.email || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch additional user data from Firestore if needed
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userDoc = await firestore.collection("users").doc(user.uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          setDisplayName(data.displayName || "");
          setEmail(data.email || user.email);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update Firebase Auth profile
      await user.updateProfile({
        displayName: displayName,
      });

      // Update Firestore user document
      const userDocRef = firestore.collection("users").doc(user.uid);
      const userDoc = await userDocRef.get();
      if (userDoc.exists) {
        await userDocRef.update({
          displayName: displayName,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        await userDocRef.set({
          displayName: displayName,
          email: email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <form onSubmit={handleProfileUpdate}>
        <label htmlFor="displayName">Display Name:</label>
        <input
          type="text"
          id="displayName"
          placeholder="Enter your display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Email is read-only"
          value={email}
          readOnly
        />
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
