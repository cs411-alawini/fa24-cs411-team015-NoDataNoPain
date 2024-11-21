import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const today = new Date();
const formattedDate = today.toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const Dashboard = () => {
  const [quote, setQuote] = useState(null);
  const [author, setAuthor] = useState(null);

  const [exercises, setExercises] = useState([]);
  const [meals, setMeals] = useState({
    breakfast: { food: [], drink: [] },
    lunch: { food: [], drink: [] },
    dinner: { food: [], drink: [] },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch quote
        const quoteResponse = await fetch("http://localhost:5001/api/random-quote");
        if (!quoteResponse.ok) {
          throw new Error(`HTTP error! status: ${quoteResponse.status}`);
        }
        const quoteData = await quoteResponse.json(); 
        setQuote(quoteData.quote);
        setAuthor(quoteData.author);

        // Fetch exercises
        const exercisesResponse = await fetch("http://localhost:5001/api/exercises");
        if (!exercisesResponse.ok) {
          throw new Error(`HTTP error! status: ${exercisesResponse.status}`);
        }
        const exercisesData = await exercisesResponse.json(); 
        setExercises(exercisesData);

        // Fetch meals
        const fetchMeal = async () => {
          const mealResponse = await fetch("http://localhost:5001/api/foodrink");
          if (!mealResponse.ok) {
            throw new Error(`HTTP error! status: ${mealResponse.status}`);
          }
          return mealResponse.json();
        };

        const breakfast = await fetchMeal();
        const lunch = await fetchMeal();
        const dinner = await fetchMeal();

        setMeals({ breakfast, lunch, dinner });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <header className="header">
        <div className="profile">
          <span className="profile-icon">👤</span>
          <span className="username">Username</span>
        </div>
        <div className="menu-icon">☰</div>
      </header>
      <div className="content">
        <div className="left-side">
          <div className="meals">
            <h3>Meals</h3>
            <div className="meals-container">
              <div className="meal-section">
                <h5>🍳 Breakfast</h5>
                <ul>
                  {meals.breakfast.food.map((item, index) => (
                    <li key={index}>
                      {item.FoodName} ({item.CaloriesTotal} kcal, {item.Quantity} units)
                    </li>
                  ))}
                  {meals.breakfast.drink.map((item, index) => (
                    <li key={index}>
                      {item.DrinkName} ({item.CaloriesTotal} kcal, {item.Quantity} units)
                    </li>
                  ))}
                </ul>
              </div>
              <div className="meal-section">
                <h5>🥗 Lunch</h5>
                <ul>
                  {meals.lunch.food.map((item, index) => (
                    <li key={index}>
                      {item.FoodName} ({item.CaloriesTotal} kcal, {item.Quantity} units)
                    </li>
                  ))}
                  {meals.lunch.drink.map((item, index) => (
                    <li key={index}>
                      {item.DrinkName} ({item.CaloriesTotal} kcal, {item.Quantity} units)
                    </li>
                  ))}
                </ul>
              </div>
              <div className="meal-section">
                <h5>🍽 Dinner</h5>
                <ul>
                  {meals.dinner.food.map((item, index) => (
                    <li key={index}>
                      {item.FoodName} ({item.CaloriesTotal} kcal, {item.Quantity} units)
                    </li>
                  ))}
                  {meals.dinner.drink.map((item, index) => (
                    <li key={index}>
                      {item.DrinkName} ({item.CaloriesTotal} kcal, {item.Quantity} units)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="exercises">
            <h3>Workout of the Day 💪</h3>
            <div className="workout-container">
              {exercises.slice(0, 3).map((exercise, index) => (
                <div key={index} className="workout-section">
                  <h5>{exercise.ExerciseName}</h5>
                  <p>Reps: {exercise.Reps}</p>
                  <p>Time: {exercise.Time} minutes</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="sidebar">
          <div className="module-box">
            <h4>📅 Calendar</h4>
            <p>{formattedDate}</p>
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
              {quote ? (
                <p>
                  "{quote}" <br />
                  <strong>- {author}</strong>
                </p>
              ) : (
                <p>You miss 100% of the shots you don't take</p>
              )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
