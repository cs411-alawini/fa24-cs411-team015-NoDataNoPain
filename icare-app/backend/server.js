import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Use import for node-fetch

const app = express();
const PORT = 5001;

app.use(cors()); // Enable CORS for all requests

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
