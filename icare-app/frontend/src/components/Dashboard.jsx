import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const today = new Date();
const formattedDate = today.toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const Dashboard = () => {
  const [quote, setQuote] = useState("Every day is a fresh start."); // Default quote
  const [author, setAuthor] = useState(""); // Default author

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        // Fetch quote from your backend server
        const response = await fetch("http://localhost:5001/api/quote");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.data) {
          setQuote(data.data[0].quoteText.trim()); 
          setAuthor(data.data[0].quoteAuthor); 
        }
      } catch (error) {
        console.error("Error fetching the quote:", error);
      }
    };

    fetchQuote();
  }, []); 

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="profile">
          <span className="profile-icon">👤</span>
          <span className="username">Username</span>
        </div>
        <div className="menu-icon">☰</div>
      </header>

      {/* Main Content */}
      <div className="content">
        {/* Left Side: Meals and Exercises */}
        <div className="left-side">
          {/* Meals Section */}
          <div className="meals">
            <h3>Meals</h3>
            <div className="meals-container">
              <div className="meal-section">
                <h5>🍳 Breakfast</h5>
                <ul>
                  <li>Egg (70 kcal, 2 pcs)</li>
                  <li>Milk (100 kcal, 1 cup)</li>
                  <li>Bread (80 kcal, 2 slices)</li>
                </ul>
              </div>
              <div className="meal-section">
                <h5>🥗 Lunch</h5>
                <ul>
                  <li>Chipotle (600 kcal, 1 bowl)</li>
                  <li>Orange Juice (120 kcal, 1 glass)</li>
                </ul>
              </div>
              <div className="meal-section">
                <h5>🍽 Dinner</h5>
                <ul>
                  <li>Caesar Salad (200 kcal, 1 plate)</li>
                  <li>Protein Drink (150 kcal, 1 shake)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Exercises Section */}
          <div className="exercises">
            <h3>Workout of the Day 💪</h3>
            <div className="workout-container">
              <div className="workout-section">
                <h5>Bench Press</h5>
                <p>Reps: 10x3</p>
                <p>Time: 15 min</p>
              </div>
              <div className="workout-section">
                <h5>Push-Ups</h5>
                <p>Reps: 20x2</p>
                <p>Time: 10 min</p>
              </div>
              <div className="workout-section">
                <h5>Dips</h5>
                <p>Reps: 15x3</p>
                <p>Time: 12 min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="module-box">
            <h4>📅 Calendar</h4>
            <p>{formattedDate}</p> {/* Display formatted date */}
          </div>
          <div className="module-box">
            <h4>☀️ Weather</h4>
            <p>Sunny 90°F</p>
            <small>Best day to workout</small>
          </div>
          <div className="module-box">
            <h4>🍎 Calories</h4>
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${(600 / 2000) * 100}%` }}
              ></div>
            </div>
            <small>600 / 2000 kcal</small>
          </div>
          <div className="module-box">
            <h4>💡 Quote of the Day</h4>
            <p>"{quote}"</p>
            {author && <small>- {author}</small>}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
