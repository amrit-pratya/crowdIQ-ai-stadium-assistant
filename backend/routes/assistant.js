const express = require("express");
const router = express.Router();

const crowdData = require("../data/crowdData");
const { getAIResponse } = require("../services/aiService");

router.post("/ask", async (req, res) => {
  const { query, history } = req.body; // 🔥 get history

  try {
    const aiAnswer = await getAIResponse(
      query,
      crowdData,
      history || [] // 🔥 pass history safely
    );

    res.json({
      answer: aiAnswer
    });

  } catch (error) {
    console.error("FULL ERROR:", error.message);
    console.error(error);

    res.json({
      answer: "Error generating AI response"
    });
  }
});

module.exports = router;