import React from "react";
import "./ResultDialog.css"; // Custom CSS for ResultDialog

const ResultDialog = ({ isVisible, onClose, data }) => {
  if (!isVisible) return null;

  return (
    <div className="result-dialog-overlay">
      <div className="result-dialog-box">
        <h3>Search Results</h3>
        <p>
          <strong>Type:</strong> {data?.selection || "N/A"}
        </p>
        <p>
          <strong>Result:</strong> {data?.keyword || "N/A"}
        </p>
        <div className="result-dialog-buttons">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDialog;