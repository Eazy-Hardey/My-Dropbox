// src/App.js

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Updated for react-router-dom v6
import Navbar from "./components/Navbar";
import Authenticator from "./components/Authenticator";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
import VersionModal from "./components/VersionModal";
import ProfilePage from "./components/ProfilePage"; // Assuming you have this component
import { auth } from "./firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    <Router>
      <div className="App">
        <ToastContainer />
        {user && <Navbar />}
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route
                path="/dashboard"
                element={
                  <>
                    <FileUpload />
                    <FileList openModal={openModal} />
                    <VersionModal
                      isOpen={isModalOpen}
                      onClose={closeModal}
                      fileId={selectedFileId}
                    />
                  </>
                }
              />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Authenticator />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
