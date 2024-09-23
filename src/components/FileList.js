// src/components/FileList.js

import React, { useEffect, useState } from "react";
import { firestore, storage, auth } from "../firebase";
import { toast } from "react-toastify"; // Import toast
import "./FileList.css";

const FileList = ({ openModal }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.log("No authenticated user found.");
      return;
    }

    const unsubscribe = firestore
      .collection("files")
      .where("uid", "==", user.uid)
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snapshot) => {
          const fetchedFiles = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFiles(fetchedFiles);
          console.log("Fetched files from Firestore:", fetchedFiles);
        },
        (error) => {
          console.error("Error fetching files:", error);
          toast.error("Failed to fetch files."); // Use toast
        }
      );

    return () => unsubscribe();
  }, []);

  const handleDownload = (file) => {
    window.open(file.url, "_blank");
  };

  const handleDelete = async (file) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${file.name}?`
    );
    if (!confirmDelete) return;

    try {
      // Delete from Storage
      const fileRef = storage.ref().child(`files/${file.uid}/${file.name}`);
      await fileRef.delete();
      console.log(`Deleted file from Storage: ${file.name}`);

      // Delete from Firestore
      await firestore.collection("files").doc(file.id).delete();
      console.log(`Deleted file document from Firestore: ${file.id}`);

      toast.success("File deleted successfully."); // Use toast
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file."); // Use toast
    }
  };

  const handleViewVersions = (fileId) => {
    openModal(fileId);
  };

  return (
    <div className="filelist-container">
      <h2>Your Files</h2>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              <span>{file.name}</span>
              <div>
                <button onClick={() => handleDownload(file)}>Download</button>
                <button onClick={() => handleDelete(file)}>Delete</button>
                <button onClick={() => handleViewVersions(file.id)}>
                  Versions
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
