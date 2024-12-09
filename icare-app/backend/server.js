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

app.get("/api/foodrink", async (req, res) => {
  try {
    const foodQuery = `SELECT FoodName, NutritionType, CaloriesPerGram, Quantity, CaloriesTotal FROM Food ORDER BY RAND() LIMIT 2;`;
    const [food] = await connection.query(foodQuery);

    const drinkQuery = `SELECT DrinkName, NutritionType, CaloriesPerGram, Quantity, CaloriesTotal FROM Drink ORDER BY RAND() LIMIT 1;`;
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
