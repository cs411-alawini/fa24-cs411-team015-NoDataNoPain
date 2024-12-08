import React, { useState } from "react";
import "./SearchDialog.css"; // Custom CSS for SearchDialog

const SearchDialog = ({ title, isVisible, onClose, onSubmit }) => {
  const [selection, setSelection] = useState("Meal");
  const [keyword, setKeyword] = useState("");

  const handleSubmit = () => {
    const data = { selection, keyword };
    onSubmit(data); // Pass data to the parent component
    setSelection("Meal");
    setKeyword("");
    onClose(); // Close the dialog
  };

  if (!isVisible) return null;

  return (
    <div className="search-dialog-overlay">
      <div className="search-dialog-box">
        <h3>{title}</h3>

        {/* Dropdown for selecting meal or workout */}
        <div>
          <label>
            Search Type:
            <select
              value={selection}
              onChange={(e) => setSelection(e.target.value)}
            >
              <option value="Meal">Meal</option>
              <option value="Workout">Workout</option>
            </select>
          </label>
        </div>

        {/* Input for the keyword */}
        <div>
          <label>
            Keyword:
            <input
              type="text"
              placeholder="Enter keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </label>
        </div>

        {/* Action buttons */}
        <div className="search-dialog-buttons">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" onClick={handleSubmit}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchDialog;