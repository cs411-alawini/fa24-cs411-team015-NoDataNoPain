import React, { useState, useEffect } from "react";
import "./MealsDialog.css"; // Custom CSS for MealsDialog
import axios from "axios";

const MealsDialog = ({ isVisible, onClose }) => {
  const [mealDetails, setMealDetails] = useState({});

  useEffect(() => {
    if (isVisible) {
      fetchMealDetails();
    }
  }, [isVisible]);

  const fetchMealDetails = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/user-meals-details");
      const limitedDetails = Object.fromEntries(
        Object.entries(response.data).map(([mealId, items]) => [
          mealId,
          {
            foods: items.foods.slice(0, 2), // Limit foods to 2
            drinks: items.drinks.slice(0, 1), // Limit drinks to 1
          },
        ])
      );
      setMealDetails(limitedDetails);
    } catch (error) {
      console.error("Error fetching meal details:", error);
    }
  };

  const removeMealId = async (mealId) => {
    try {
      // Call the DELETE API
      await axios.delete(`http://localhost:5001/api/delete-meal/${mealId}`);
      // Remove the meal ID from the local state
      setMealDetails((prevDetails) => {
        const updatedDetails = { ...prevDetails };
        delete updatedDetails[mealId];
        return updatedDetails;
      });
    } catch (error) {
      console.error(`Error deleting Meal ID ${mealId}:`, error);
      alert(`Failed to delete Meal ID ${mealId}.`);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="meals-dialog-overlay">
      <div className="meals-dialog-box">
        <div className="dialog-header">
          <h3>Meals List</h3>
        </div>

        {Object.keys(mealDetails).length > 0 ? (
          <div className="meals-container">
            {Object.entries(mealDetails).map(([mealId, items]) => (
              <div key={mealId} className="meal-section">
                <h4>Meal ID: {mealId}</h4>
                <ul className="meal-items">
                  {items.foods.map((food, idx) => (
                    <li key={`food-${idx}`} className="meal-item">
                      {food.FoodName} - {food.CaloriesTotal} kcal (
                      {food.Quantity} units) [{food.NutritionType}]
                    </li>
                  ))}
                  {items.drinks.map((drink, idx) => (
                    <li key={`drink-${idx}`} className="meal-item">
                      {drink.DrinkName} - {drink.CaloriesTotal} kcal (
                      {drink.Quantity} units) [{drink.NutritionType}]
                    </li>
                  ))}
                </ul>
                <button
                  className="remove-meal-btn"
                  onClick={() => removeMealId(mealId)}
                >
                  Remove Meal ID {mealId}
                </button>
              </div>
            ))}
          </div>
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
