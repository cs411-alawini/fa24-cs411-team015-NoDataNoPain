import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; 
import mysql from "mysql2/promise";

const app = express();
const PORT = 5001;

app.use(cors()); // Enable CORS for all requests
app.use(express.json());


const pool = mysql.createPool({
  host: "cs411-final-project-440018:us-central1:fitness-sqldatabase",
  user: "root",    // Replace with your database username
  password: "",// Replace with your database password
  database: "fitness-sqldatabase",// Replace with your database name
  port: 5001,               // MySQL default port
});

// Proxy route for ZenQuotes API
app.get("/api/quote", async (req, res) => {
  try {
    const response = await fetch("https://quote-garden.onrender.com/api/v3/quotes/random");
    const data = await response.json();
    res.json(data); // Send the response to the frontend
  } catch (error) {
    console.error("Error fetching quote:", error);
    res.status(500).json({ error: "Failed to fetch quote" });
  }
});

// const updateData = (id, newData) => {
//   console.log(`Updating record with ID: ${id}, new data:`, newData);
//   return {
//     message: "Data updated successfully",
//     updatedId: id,
//     updatedData: newData,
//   };
// };

app.post("/api/data", async (req, res) => {
  try {
    const { query } = req.body; // Accept SQL query from the request body

    if (!query) {
      return res.status(400).json({ error: "No query provided" });
    }

    const [rows] = await pool.query(query); 
    res.status(200).json(rows);            
  } catch (error) {
    console.error("Error fetching data from SQL:", error);
    res.status(500).json({ error: "Failed to fetch data from SQL" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
