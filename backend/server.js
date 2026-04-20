require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors({
  origin: "*", // allow all for now (you can restrict later)
}));
app.use(express.json());

// ✅ Routes
const crowdData = require("./data/crowdData");
const assistantRoutes = require("./routes/assistant");

// 🔹 Base route (health check)
app.get("/", (req, res) => {
  res.send("CrowdIQ Backend Running 🚀");
});

// 🔹 Static crowd data
app.get("/crowd", (req, res) => {
  res.json(crowdData);
});

// 🔹 Live crowd data (same for now, can be Firebase later)
app.get("/live-crowd", (req, res) => {
  res.json(crowdData);
});

// 🔹 AI Assistant route
app.use("/assistant", assistantRoutes);

// ✅ IMPORTANT: Dynamic PORT for deployment
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});