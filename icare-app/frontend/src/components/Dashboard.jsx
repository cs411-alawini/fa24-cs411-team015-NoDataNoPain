import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import Dialog from "./Dialog";
import WorkoutDialog from "./WorkoutDialog";
import SearchDialog from "./SearchDialog";
import ResultDialog from "./ResultDialog";

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
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isWorkoutDialogVisible, setIsWorkoutDialogVisible] = useState(false);
  const [userInput, setUserInput] = useState(null);
  const [workoutInput, setWorkoutInput] = useState(null);
  const [isSearchDialogVisible, setIsSearchDialogVisible] = useState(false);
  const [isResultDialogVisible, setIsResultDialogVisible] = useState(false);
  const [searchData, setSearchData] = useState(null);

  const [exercises, setExercises] = useState([]);
  const [meals, setMeals] = useState({
    breakfast: { food: [], drink: [] },
    lunch: { food: [], drink: [] },
    dinner: { food: [], drink: [] },
  });

  const showDialog = () => setIsDialogVisible(true);
  const closeDialog = () => setIsDialogVisible(false);

  const showWorkoutDialog = () => setIsWorkoutDialogVisible(true);
  const closeWorkoutDialog = () => setIsWorkoutDialogVisible(false);

  const showSearchDialog = () => setIsSearchDialogVisible(true);
  const closeSearchDialog = () => setIsSearchDialogVisible(false);

  const showResultDialog = () => setIsResultDialogVisible(true);
  const closeResultDialog = () => setIsResultDialogVisible(false);

  const handleUserInput = (input) => {
    setUserInput(input); // Save the user input
    console.log("User input:", input); // Log or handle the input
  };

  const handleWorkoutInput = (input) => {
    setWorkoutInput(input);
    console.log("Workout input:", input);
  };

  const handleSearch = (data) => {
    setSearchData(data);
    closeSearchDialog(); // Close the search dialog
    showResultDialog(); // Show the result dialog
  };

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
          <button className="search-btn" onClick={showSearchDialog}>
            🔍 Search
          </button>
        </div>
        <div className="menu-icon">☰</div>
      </header>
      <div className="content">
        <div className="left-side">
          <div className="meals">
            <h3>Meals</h3>
            <div className="meals-container">
              <div className="meal-section">
                <div className="header-container">
                  <h5>🍳 Breakfast</h5>
                  <button className="add-breakfast-btn" onClick={showDialog}>
                    <i className="fas fa-plus"></i> {/* FontAwesome icon */}
                  </button>
                </div>
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
                <div className="header-container">
                  <h5>🥗 Lunch</h5>
                  <button className="add-lunch-btn" onClick={showDialog}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                
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
                <div className="header-container">
                  <h5>🍽 Dinner</h5>
                  <button className="add-dinner-btn" onClick={showDialog}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                
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
            <div className="header-container">
              <h3>Workout of the Day 💪</h3>
              <button className="add-exercise-btn" onClick={showWorkoutDialog}>
                <i className="fas fa-plus"></i> {/* FontAwesome icon */}
              </button>
            </div>
            
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
      <Dialog
        title="Add Food or Drink"
        isVisible={isDialogVisible}
        onClose={closeDialog}
        onSubmit={handleUserInput}
      />

      <WorkoutDialog
        title="Add Workout"
        isVisible={isWorkoutDialogVisible}
        onClose={closeWorkoutDialog}
        onSubmit={handleWorkoutInput}
      />

      <SearchDialog
        title="Search Meals or Workouts"
        isVisible={isSearchDialogVisible}
        onClose={closeSearchDialog}
        onSubmit={handleSearch}
      />

      <ResultDialog
        isVisible={isResultDialogVisible}
        onClose={closeResultDialog}
        data={searchData}
      />
    </div>
  );
};

export default Dashboard;
