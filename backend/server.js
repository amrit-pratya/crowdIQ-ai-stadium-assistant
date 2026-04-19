require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const crowdData = require("./data/crowdData");
const assistantRoutes = require("./routes/assistant");

// Base route
app.get("/", (req, res) => {
  res.send("CrowdIQ Backend Running");
});

// Crowd data API (static fetch if needed)
app.get("/crowd", (req, res) => {
  res.json(crowdData);
});

// 🔥 NEW: Live crowd data endpoint
app.get("/live-crowd", (req, res) => {
  res.json(crowdData);
});

// Assistant API
app.use("/assistant", assistantRoutes);

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});