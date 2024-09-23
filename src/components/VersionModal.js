// src/components/VersionModal.js

import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import "./VersionModal.css";
import { toast } from "react-toastify";

const VersionModal = ({ isOpen, onClose, fileId }) => {
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    if (!fileId) return;

    const unsubscribe = firestore
      .collection("files")
      .doc(fileId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setVersions(doc.data().versions || []);
          console.log(`Fetched versions for file: ${fileId}`);
        }
      }, (error) => {
        console.error("Error fetching versions:", error);
        toast.error("Failed to fetch file versions.");
      });

    return () => unsubscribe();
  }, [fileId]);

  if (!isOpen) return null;

  const handleDownload = (version) => {
    window.open(version.url, "_blank");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>File Versions</h2>
        {versions.length === 0 ? (
          <p>No previous versions.</p>
        ) : (
          <ul>
            {versions
              .sort((a, b) => b.version - a.version)
              .map((version, index) => (
                <li key={index}>
                  <span>
                    {new Date(version.version).toLocaleString()}
                  </span>
                  <button onClick={() => handleDownload(version)}>
                    Download
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VersionModal;
