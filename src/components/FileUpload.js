// src/components/FileUpload.js

import React, { useState } from "react";
import { storage, firestore, auth } from "../firebase";
import firebase from "firebase/compat/app";
import { toast } from "react-toastify"; // Import toast
import "./FileUpload.css";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const user = auth.currentUser;
    const filePath = `files/${user.uid}/${file.name}`;
    const fileRef = storage.ref().child(filePath);

    try {
      // Upload the file to Firebase Storage
      await fileRef.put(file);

      // Get the download URL
      const downloadURL = await fileRef.getDownloadURL();

      // Add file info to Firestore
      await firestore.collection("files").add({
        name: file.name,
        url: downloadURL,
        uid: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        versions: [],
      });

      toast.success("File uploaded successfully!"); // Use toast
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file."); // Use toast
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload File</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} required />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
