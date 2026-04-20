require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// 🔥 Firebase
const db = require("./firebase");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const assistantRoutes = require("./routes/assistant");

// Base route
app.get("/", (req, res) => {
  res.send("CrowdIQ Backend Running");
});


// 🔥 LIVE CROWD DATA FROM FIREBASE
app.get("/crowd", async (req, res) => {
  try {
    const doc = await db.collection("crowd").doc("stadium").get();

    if (!doc.exists) {
      return res.json({});
    }

    res.json(doc.data());

  } catch (error) {
    console.error("Error fetching crowd data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});


// (Optional) alias endpoint if you want both
app.get("/live-crowd", async (req, res) => {
  try {
    const doc = await db.collection("crowd").doc("stadium").get();

    if (!doc.exists) {
      return res.json({});
    }

    res.json(doc.data());

  } catch (error) {
    console.error("Error fetching live crowd:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});


// Assistant API
app.use("/assistant", assistantRoutes);

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});