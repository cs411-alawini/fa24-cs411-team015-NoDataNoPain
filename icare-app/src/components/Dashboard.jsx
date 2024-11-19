import React from "react";
import "./Dashboard.css";
import { useState } from "react";

const Dashboard = () => {
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
      <main className="main">
        <div className="section meals">
          {/* Breakfast Section */}
          <div className="meal-section">
            <h5>🍳 Breakfast</h5>
            <div className="meal-content">
              <p>egg</p>
              <p>milk</p>
              <p>bread</p>
            </div>
          </div>

          {/* Lunch Section */}
          <div className="meal-section">
            <h5>🥗 Lunch</h5>
            <div className="meal-content">
              <p>chipotle</p>
              <p>orange juice</p>
            </div>
          </div>

          {/* Dinner Section */}
          <div className="meal-section">
            <h5>🍽 Dinner</h5>
            <div className="meal-content">
              <p>ceasar salad</p>
              <p>protein drink</p>
            </div>
          </div>
        </div>

        <div className="section exercises">
          <div className="workout-section">
            <h5>💪 Workout of the Day</h5>
            <p>bench press</p>
            <p>push-up</p>
            <p>dip</p>
          </div>
          
        </div>
      </main>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="calendar">
          <h4>Calendar</h4>
          <div className="calendar-box">
            <span>📅</span>
            <p>Today's Date</p>
          </div>
        </div>
        <div className="weather">
          <h4>Weather</h4>
          <div className="weather-box">
            <span>☀️</span>
            <p>Sunny 90°F</p>
            <small>Best day to workout</small>
          </div>
        </div>
        <div className="calories">
          <h4>Calories</h4>
          <div className="calories-box">
            <span>🍎</span>
            <p></p>
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${Math.min((600 / 2000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="quote">
          <h4>Quote of the Day</h4>
          <div className="quote-box">
            <span>💡</span>
            <p></p>
            <small>Every day is a fresh start.</small>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;

