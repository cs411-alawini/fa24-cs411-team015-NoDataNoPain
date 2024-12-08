import React, { useState } from "react";
import "./Dialog.css";

const Dialog = ({ title, isVisible, onClose, onSubmit }) => {
  const [selection, setSelection] = useState("Food"); // Default to "Food"
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");

  const handleSubmit = () => {
    const data = { selection, name, calories };
    onSubmit(data); // Pass the data to the parent
    setSelection("Food");
    setName("");
    setCalories("");
    onClose(); // Close the dialog
  };

  if (!isVisible) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>{title}</h3>

        {/* Dropdown for selection */}
        <div>
          <label>
            Choose Type:
            <select
              value={selection}
              onChange={(e) => setSelection(e.target.value)}
            >
              <option value="Food">Food</option>
              <option value="Drink">Drink</option>
            </select>
          </label>
        </div>

        {/* Input for name */}
        <div>
          <label>
            Name:
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>

        {/* Input for calories */}
        <div>
          <label>
            Calories:
            <input
              type="number"
              placeholder="Enter calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </label>
        </div>

        <div className="dialog-buttons">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;