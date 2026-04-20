const express = require("express");
const router = express.Router();

const db = require("../firebase");
const { getAIResponse } = require("../services/aiService");

router.post("/ask", async (req, res) => {
  const { query, history = [] } = req.body;

  try {
    // 🔥 Fetch from Firebase
    const doc = await db.collection("crowd").doc("stadium").get();

    if (!doc.exists) {
      return res.json({ answer: "No crowd data available." });
    }

    const crowdData = doc.data();

    const aiAnswer = await getAIResponse(query, crowdData, history);

    res.json({ answer: aiAnswer });

  } catch (error) {
    console.error("ERROR:", error.message);
    res.json({ answer: "Error generating AI response" });
  }
});

module.exports = router;