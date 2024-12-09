import React, { useState } from "react";
import "./MealsDialog.css"; // Custom CSS for MealsDialog

const MealsDialog = ({ isVisible, meals, onClose, onRemove }) => {
  const [showRemoveButtons, setShowRemoveButtons] = useState(false);
  if (!isVisible) return null;
  meals = ["Pizza", "Burger", "Salad", "Pasta"];

  return (
    <div className="meals-dialog-overlay">
      <div className="meals-dialog-box">
        <div className="dialog-header">
          <h3>Meals List</h3>
          <button
            className="toggle-remove-btn"
            onClick={() => setShowRemoveButtons((prev) => !prev)}
          >
            {showRemoveButtons ? "Hide Remove" : "Remove All"}
          </button>
        </div>

        {meals.length > 0 ? (
          <ul className="meals-list">
            {meals.map((meal, index) => (
              <li key={index} className="meal-item">
                <span>{meal}</span>
                {showRemoveButtons && (
                  <button
                    className="remove-btn"
                    onClick={() => onRemove(index)}
                  >
                    -
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No meals available</p>
        )}
        <div className="meals-dialog-buttons">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealsDialog;