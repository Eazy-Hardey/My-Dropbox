// src/components/FolderNavigator.js

import React from "react";
import { Link } from "react-router-dom";
import "./FolderNavigator.css";

const FolderNavigator = ({ currentPath }) => {
  const pathSegments = currentPath.split("/").filter((seg) => seg !== "");

  const buildPath = (index) => {
    return "/folder/" + pathSegments.slice(0, index + 1).join("/");
  };

  return (
    <div className="folder-navigator">
      <Link to="/" className="folder-link">
        Root
      </Link>
      {pathSegments.map((segment, index) => (
        <span key={index}>
          {" / "}
          <Link to={buildPath(index)} className="folder-link">
            {segment}
          </Link>
        </span>
      ))}
    </div>
  );
};

export default FolderNavigator;
