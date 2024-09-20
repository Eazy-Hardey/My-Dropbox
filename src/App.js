// src/App.js

import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Authenticator from "./components/Authenticator";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
import VersionModal from "./components/VersionModal";
import { auth } from "./firebase";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import CSS
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const openModal = (fileId) => {
    setSelectedFileId(fileId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFileId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <ToastContainer /> {/* Add ToastContainer */}
      {user ? (
        <>
          <Navbar />
          <FileUpload />
          <FileList openModal={openModal} />
          <VersionModal
            isOpen={isModalOpen}
            onClose={closeModal}
            fileId={selectedFileId}
          />
        </>
      ) : (
        <Authenticator />
      )}
    </div>
  );
}

export default App;
