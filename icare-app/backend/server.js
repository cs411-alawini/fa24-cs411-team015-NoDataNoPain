import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Use import for node-fetch

const app = express();
const PORT = 5001;

app.use(cors()); // Enable CORS for all requests
app.use(express.json());

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

const updateData = (id, newData) => {
  console.log(`Updating record with ID: ${id}, new data:`, newData);
  return {
    message: "Data updated successfully",
    updatedId: id,
    updatedData: newData,
  };
};


app.post("/api/update", (req, res) => {
  try {
    const { id, newData } = req.body;

    if (!id || !newData) {
      return res.status(400).json({ error: "Missing required fields: id and newData" });
    }

    // Call the updateData function
    const result = updateData(id, newData);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error handling POST request:", error);
    res.status(500).json({ error: "Failed to update data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
