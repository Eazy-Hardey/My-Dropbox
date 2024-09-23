// src/components/FileUpload.js

import React, { useState } from "react";
import { storage, firestore, auth } from "../firebase";
import firebase from "firebase/compat/app";
import { toast } from "react-toastify";
import "./FileUpload.css";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [folderPath, setFolderPath] = useState(""); // New state for folder path
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFolderChange = (e) => {
    setFolderPath(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const user = auth.currentUser;
    const sanitizedFolderPath = folderPath.trim() || "root";
    const fullFolderPath = sanitizedFolderPath.startsWith("/")
      ? sanitizedFolderPath.slice(1)
      : sanitizedFolderPath;
    const filePath = `files/${user.uid}/${fullFolderPath}/${file.name}`;
    const fileRef = storage.ref().child(filePath);

    try {
      console.log(`Uploading file to: ${filePath}`);
      // Upload the file to Firebase Storage
      await fileRef.put(file);
      console.log("File uploaded to Firebase Storage.");

      // Get the download URL
      const downloadURL = await fileRef.getDownloadURL();
      console.log(`Download URL: ${downloadURL}`);

      // Add file info to Firestore
      const docRef = await firestore.collection("files").add({
        name: file.name,
        url: downloadURL,
        uid: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        folderPath: sanitizedFolderPath || "root",
        versions: [],
      });
      console.log(`File document created with ID: ${docRef.id}`);

      toast.success("File uploaded successfully!");
      setFile(null);
      setFolderPath("");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!folderPath.trim()) {
      toast.error("Folder name cannot be empty.");
      return;
    }
    setUploading(true);
    const user = auth.currentUser;
    const sanitizedFolderPath = folderPath.trim();
    const fullFolderPath = sanitizedFolderPath.startsWith("/")
      ? sanitizedFolderPath.slice(1)
      : sanitizedFolderPath;
    const folderDocPath = `folders/${user.uid}/${fullFolderPath}`;

    try {
      console.log(`Creating folder at: ${folderDocPath}`);
      await firestore.doc(folderDocPath).set({
        name: sanitizedFolderPath,
        uid: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      toast.success("Folder created successfully!");
      setFolderPath("");
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload File</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} required />
        <input
          type="text"
          placeholder="Folder Path (e.g., folder1/folder2)"
          value={folderPath}
          onChange={handleFolderChange}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      <h2>Create New Folder</h2>
      <form onSubmit={handleCreateFolder}>
        <input
          type="text"
          placeholder="New Folder Name (e.g., folder3)"
          value={folderPath}
          onChange={handleFolderChange}
          required
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Creating..." : "Create Folder"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
