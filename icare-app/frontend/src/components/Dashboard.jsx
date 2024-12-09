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
import MealsDialog from "./MealsDialog";

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
  const [currentMealType, setCurrentMealType] = useState(null);
  const [isSearchDialogVisible, setIsSearchDialogVisible] = useState(false);
  const [isResultDialogVisible, setIsResultDialogVisible] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [isMealsDialogVisible, setIsMealsDialogVisible] = useState(false);
  const [weather, setWeather] = useState({ temperature: null, location: null });
  
  const [weeklyCalories, setWeeklyCalories] = useState(0);
  const [mostCaloricFood, setMostCaloricFood] = useState({ foodName: "Unknown", calories: 0 });

  useEffect(() => {
    const fetchWeeklyCalories = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/total-calories-week");
        setWeeklyCalories(response.data.totalCalories || 0);
      } catch (error) {
        console.error("Error fetching weekly calories:", error);
      }
    };

    const fetchMostCaloricFood = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/most-caloric-food");
        setMostCaloricFood({
          foodName: response.data.foodName || "Unknown",
          calories: response.data.calories || 0,
        });
      } catch (error) {
        console.error("Error fetching most caloric food:", error);
      }
    };

    fetchWeeklyCalories();
    fetchMostCaloricFood();
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/weather");
        setWeather(response.data);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    fetchWeather();
  }, []);

  const [exercises, setExercises] = useState([]);
  const [meals, setMeals] = useState({
    breakfast: { food: [], drink: [] },
    lunch: { food: [], drink: [] },
    dinner: { food: [], drink: [] },
  });

  const [recommendations, setRecommendations] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  const showDialog = (mealType) => {
    setCurrentMealType(mealType);
    setIsDialogVisible(true);
  };
  const closeDialog = () => setIsDialogVisible(false);

  const showWorkoutDialog = () => setIsWorkoutDialogVisible(true);
  const closeWorkoutDialog = () => setIsWorkoutDialogVisible(false);

  const showSearchDialog = () => setIsSearchDialogVisible(true);
  const closeSearchDialog = () => setIsSearchDialogVisible(false);

  const showResultDialog = () => setIsResultDialogVisible(true);
  const closeResultDialog = () => setIsResultDialogVisible(false);

  const showMealsDialog = () => setIsMealsDialogVisible(true);
  const closeMealsDialog = () => setIsMealsDialogVisible(false);

  const handleUserInput = async (data) => {
    const mealType = currentMealType;
    if (!mealType || !meals[mealType]) {
      alert("Invalid meal type.");
      return;
    }

    const updatedData = { ...data, mealType };

    try {
      const response = await axios.post("http://localhost:5001/api/add-item", updatedData);
      if (data.selection === "Food") {
        setMeals((prevMeals) => ({
          ...prevMeals,
          [mealType]: {
            ...prevMeals[mealType],
            food: [
              ...prevMeals[mealType].food,
              {
                FoodName: data.name,
                CaloriesTotal: data.calories,
                Quantity: data.qty,
              },
            ],
          },
        }));
      } else if (data.selection === "Drink") {
        setMeals((prevMeals) => ({
          ...prevMeals,
          [mealType]: {
            ...prevMeals[mealType],
            drink: [
              ...prevMeals[mealType].drink,
              {
                DrinkName: data.name,
                CaloriesTotal: data.calories,
                Quantity: data.qty,
              },
            ],
          },
        }));
      }
    } catch (error) {
      alert("Failed to add item to the server. Displaying locally anyway.");
      if (data.selection === "Food") {
        setMeals((prevMeals) => ({
          ...prevMeals,
          [mealType]: {
            ...prevMeals[mealType],
            food: [
              ...prevMeals[mealType].food,
              {
                FoodName: data.name,
                CaloriesTotal: data.calories,
                Quantity: data.qty,
              },
            ],
          },
        }));
      } else if (data.selection === "Drink") {
        setMeals((prevMeals) => ({
          ...prevMeals,
          [mealType]: {
            ...prevMeals[mealType],
            drink: [
              ...prevMeals[mealType].drink,
              {
                DrinkName: data.name,
                CaloriesTotal: data.calories,
                Quantity: data.qty,
              },
            ],
          },
        }));
      }
    }
  };

  const handleWorkoutInput = (input) => {
    setWorkoutInput(input);
  };

  const handleSearch = (data) => {
    setSearchData(data);
    closeSearchDialog();
    showResultDialog();
  };

  const handleRemoveMeal = (index) => {
    const updatedMeals = meals.filter((_, i) => i !== index);
    setMeals(updatedMeals); // Update the meals list
  };

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quoteResponse = await fetch("http://localhost:5001/api/random-quote");
        if (quoteResponse.ok) {
          const quoteData = await quoteResponse.json();
          setQuote(quoteData.quote);
          setAuthor(quoteData.author);
        }

        const exercisesResponse = await fetch("http://localhost:5001/api/exercises");
        if (exercisesResponse.ok) {
          const exercisesData = await exercisesResponse.json();
          setExercises(exercisesData);
        }

        const breakfastRecommendations = await axios.get("http://localhost:5001/api/recommend?meal=breakfast");
        const lunchRecommendations = await axios.get("http://localhost:5001/api/recommend?meal=lunch");
        const dinnerRecommendations = await axios.get("http://localhost:5001/api/recommend?meal=dinner");

        setRecommendations({
          breakfast: breakfastRecommendations.data,
          lunch: lunchRecommendations.data,
          dinner: dinnerRecommendations.data,
        });
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
          <span className="username">matthewyoung</span>
          <button className="search-btn" onClick={showSearchDialog}>
            🔍 Search
          </button>
        </div>
        <button className="menu-icon" onClick={showMealsDialog}>
          View All Meals
        </button>
      </header>
      <div className="content">
        <div className="left-side">
          <div className="meals">
            <h3>Meals</h3>
            <div className="meals-container">
              <div className="meal-section">
                <div className="header-container">
                  <h5>🍳 Breakfast</h5>
                  <button className="add-breakfast-btn" onClick={() => showDialog('breakfast')}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                {meals.breakfast.food.length === 0 && meals.breakfast.drink.length === 0 ? (
                  <p>No items added yet. Use the "+" button to add.</p>
                ) : (
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
                )}
                <h6>Recommended:</h6>
                <ul>
                  {recommendations.breakfast.map((item, index) => (
                    <li key={index}>
                      {item.name} ({item.calories} kcal, {item.qty} units)
                    </li>
                  ))}
                </ul>
              </div>
              <div className="meal-section">
                <div className="header-container">
                  <h5>🥗 Lunch</h5>
                  <button className="add-lunch-btn" onClick={() => showDialog('lunch')}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                {meals.lunch.food.length === 0 && meals.lunch.drink.length === 0 ? (
                  <p>No items added yet. Use the "+" button to add.</p>
                ) : (
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
                )}
                <h6>Recommended:</h6>
                <ul>
                  {recommendations.lunch.map((item, index) => (
                    <li key={index}>
                      {item.name} ({item.calories} kcal, {item.qty} units)
                    </li>
                  ))}
                </ul>
              </div>
              <div className="meal-section">
                <div className="header-container">
                  <h5>🍽 Dinner</h5>
                  <button className="add-dinner-btn" onClick={() => showDialog('dinner')}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                {meals.dinner.food.length === 0 && meals.dinner.drink.length === 0 ? (
                  <p>No items added yet. Use the "+" button to add.</p>
                ) : (
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
                )}
                <h6>Recommended:</h6>
                <ul>
                  {recommendations.dinner.map((item, index) => (
                    <li key={index}>
                      {item.name} ({item.calories} kcal, {item.qty} units)
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
                <i className="fas fa-plus"></i>
              </button>
            </div>
            <div className="workout-container">
              {exercises.slice(0, 3).map((exercise, index) => (
                <div key={index} className="workout-section">
                  <h5>{exercise.ExerciseName}</h5>
                  <p>Reps: {exercise.Reps}</p>
                  <p>Time: {exercise.Time}</p>
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
            {weather.temperature !== null ? (
              <p>
                {weather.location}: {weather.temperature}°C
              </p>
            ) : (
              <p>Loading weather...</p>
            )}
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
            <p>Total calories this week: <strong>{weeklyCalories}</strong> kcal</p>
            <p>
              Most caloric food last week: <strong>{mostCaloricFood.foodName}</strong> (
              {mostCaloricFood.calories} kcal)
            </p>
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

      <MealsDialog
        isVisible={isMealsDialogVisible}
        meals={meals}
        onClose={closeMealsDialog}
        onRemove={handleRemoveMeal}
      />
    </div>
  );
};

export default Dashboard;
