import React, { useState } from "react";
import "./Dialog.css";

const Dialog = ({ title, isVisible, onClose, onSubmit }) => {
  const [selection, setSelection] = useState("Food"); // Default to "Food"
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [qty, setQty] = useState("");
  const [nutrition, setNutrition] = useState("");

  const handleSubmit = () => {
    const data = {
      selection,    
      name,       
      calories: parseInt(calories, 10), 
      qty: parseInt(qty, 10),          
      nutrition,  
    };

    onSubmit(data);
    setSelection("Food");
    setName("");
    setCalories("");
    setQty("");
    setNutrition("");

    onClose();
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
            Calories (kCal):
            <input
              type="number"
              placeholder="Enter calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Quantity
            <input
              type="number"
              placeholder="Enter quantity"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </label>
        </div>
        
        <div>
          <label>
            Nutrition Type:
            <input
              type="text"
              placeholder="Enter nutrition type"
              value={nutrition}
              onChange={(e) => setNutrition(e.target.value)}
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