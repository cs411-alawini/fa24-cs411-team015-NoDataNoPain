import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise'; 
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, 
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
