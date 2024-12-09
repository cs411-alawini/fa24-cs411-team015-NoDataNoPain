import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise'; 
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, 
});

app.get("/api/search", async (req, res) => {
  const { selection, keyword } = req.query;
  try {
    let query;
    if (selection === "Workout") {
      query = `
        SELECT ExerciseName, Reps, Sets, Time
        FROM Exercises
        WHERE ExerciseName LIKE ?
        LIMIT 5;
      `;
    } else if (selection === "Meal") {
      
    }
    const [rows] = await connection.query(query, [`%${keyword}%`]);
    res.json(rows);
  } catch (error) {
    console.error("Error searching:", error);
    res.status(500).send("Database query failed");
  }
});

app.post("/api/add-item", async (req, res) => {
  if (!req.body) {
      console.log("No request body received. Check Content-Type header and middleware.");
      return res.status(400).json({ error: "No request body received." });
    }
    
  try {

    console.log("Incoming request body:", req.body); // Log the request body

    const { selection, name, calories, qty, nutrition } = req.body;
    if (!selection || !name || !calories || !qty || !nutrition) {
      throw new Error("Missing required fields");
    }

    console.log("Data received:", { selection, name, calories, qty, nutrition });

    let query;
    if (selection === "Food") {
      query = `
        INSERT INTO Food (FoodName, NutritionType, CaloriesPerGram, Quantity)
        VALUES (?, ?, ?, ?);
      `;
    } else if (selection === "Drink") {
      query = `
        INSERT INTO Drink (DrinkName, NutritionType, CaloriesPerGram, Quantity)
        VALUES (?, ?, ?, ?);
      `;
    } else {
      return res.status(400).json({ error: "Invalid selection" });
    }

    const [result] = await connection.query(query, [name, nutrition, calories, qty]);

    console.log("Insert successful, result:", result);
    res.status(200).json({
      id: result.insertId,
      name,
      nutrition,
      qty,
      calories,
    });
  } catch (error) {
    console.error("Error in /api/add-item route:", error.message);
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/random-quote', async (req, res) => {
    try {
        const response = await axios.get('https://quotes-api-self.vercel.app/quote');
        res.json(response.data); 
    } catch (error) {
        console.error('Error fetching the random quote:', error);
        res.status(500).send('An error occurred while fetching the random quote.');
    }
});

app.get('/api/weather', async (req, res) => {
  try {
    const weatherApiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=40.116399&longitude=-88.2434&current=temperature_2m,weather_code&timezone=America/Chicago&forecast_days=1';
    
    const response = await axios.get(weatherApiUrl);

    const { current } = response.data;

    if (current && current.temperature_2m !== undefined) {
      res.json({
        location: "Champaign, IL",
        temperature: current.temperature_2m,
      });
    } else {
      throw new Error('Missing temperature data in the weather API response.');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error.message || error);
    res.status(500).send('An error occurred while fetching the weather data.');
  }
});


app.get("/api/exercises", async (req, res) => {
  try {
    const query = `
      SELECT ExerciseName, Reps, Time
      FROM Exercises
      ORDER BY RAND()
      LIMIT 3; -- Randomly select 3 rows
    `;

    const [rows] = await connection.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).send("Database query failed");
  }
});

app.get('/api/user-meals-details', async (req, res) => {
  try {
    const userId = 100052;

    if (!userId) {
      return res.status(400).json({ error: 'Missing user_id parameter.' });
    }

    // Fetch all meal IDs for the user
    const mealQuery = `
      SELECT MealID
      FROM Meals
      WHERE UserID = ?;
    `;
    const [meals] = await connection.query(mealQuery, [userId]);

    if (meals.length === 0) {
      return res.json([]); // No meals for the user
    }

    const mealDetails = {};

    for (const { MealID } of meals) {
      const foodQuery = `
        SELECT FoodName, CaloriesTotal, Quantity, NutritionType
        FROM Food
        WHERE MealID = ?;
      `;
      const drinkQuery = `
        SELECT DrinkName, CaloriesTotal, Quantity, NutritionType
        FROM Drink
        WHERE MealID = ?;
      `;

      const [foods] = await connection.query(foodQuery, [MealID]);
      const [drinks] = await connection.query(drinkQuery, [MealID]);

      mealDetails[MealID] = {
        foods,
        drinks,
      };
    }

    res.json(mealDetails);
  } catch (error) {
    console.error('Error fetching user meal details:', error);
    res.status(500).send('An error occurred while fetching user meal details.');
  }
});

app.get("/api/foodrink", async (req, res) => {
  try {
    const foodQuery = `
      SELECT FoodName, NutritionType, CaloriesPerGram, Quantity, CaloriesTotal 
      FROM Food 
      ORDER BY RAND() 
      LIMIT 2;
    `;
    const drinkQuery = `
      SELECT DrinkName, NutritionType, CaloriesPerGram, Quantity, CaloriesTotal 
      FROM Drink 
      ORDER BY RAND() 
      LIMIT 1;
    `;

    const [food] = await connection.query(foodQuery);
    const [drink] = await connection.query(drinkQuery);

    res.json({ food, drink });
  } catch (error) {
    console.error("Error fetching food and drinks:", error);
    res.status(500).send("Database query failed");
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


app.delete('/api/delete-meal/:mealId', async (req, res) => {
  try {
    const { mealId } = req.params;

    if (!mealId) {
      return res.status(400).json({ error: 'Missing mealId parameter.' });
    }

    // Begin transaction
    const conn = await connection.getConnection();
    await conn.beginTransaction();

    try {
      // Delete all foods associated with the MealID
      const deleteFoodQuery = `
        DELETE FROM Food
        WHERE MealID = ?;
      `;
      await conn.query(deleteFoodQuery, [mealId]);

      // Delete all drinks associated with the MealID
      const deleteDrinkQuery = `
        DELETE FROM Drink
        WHERE MealID = ?;
      `;
      await conn.query(deleteDrinkQuery, [mealId]);

      // Delete the meal from the Meals table
      const deleteMealQuery = `
        DELETE FROM Meals
        WHERE MealID = ?;
      `;
      const [result] = await conn.query(deleteMealQuery, [mealId]);

      if (result.affectedRows === 0) {
        throw new Error(`MealID ${mealId} does not exist.`);
      }

      // Commit transaction
      await conn.commit();

      res.status(200).json({ message: `MealID ${mealId} and its associated items have been deleted.` });
    } catch (error) {
      // Rollback transaction if any error occurs
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error deleting meal:', error.message || error);
    res.status(500).send('An error occurred while deleting the meal.');
  }
});

app.get("/api/total-calories-week", async (req, res) => {
  try {
    const userId = 100052;
    const [rows] = await connection.query("CALL GetTotalCaloriesThisWeek(?);", [userId]);
    const totalCalories = rows[0][0]?.totalCalories || 0; 
    res.json({ totalCalories });
  } catch (error) {
    console.error("Error fetching total calories for the week:", error);
    res.status(500).send("Database query failed.");
  }
});
  
app.get("/api/most-caloric-food", async (req, res) => {
  try {
    const userId = 100052; // Replace with dynamic user ID if needed
    const [rows] = await connection.query("CALL GetMostCaloricFoodLastWeek(?);", [userId]);
    // Assuming the procedure returns a single result
    const mostCaloricFood = rows[0][0] || {}; // Replace with actual column names from the procedure result
    res.json({
      foodName: mostCaloricFood.FoodName || "Unknown Food",
      calories: mostCaloricFood.CaloriesTotal || 0,
    });
  } catch (error) {
    console.error("Error fetching most caloric food for the last week:", error);
    res.status(500).send("Database query failed.");
  }
});