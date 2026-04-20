/*

const express = require("express");
const router = express.Router();

let db = null;
try {
  db = require("../firebase");
} catch (e) {
  console.log("⚠️ Firebase not loaded (using fallback data)");
}
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
*/

const express = require("express");
const router = express.Router();

let db = null;

// 🔥 Try loading Firebase (optional)
try {
  db = require("../firebase");
} catch (e) {
  console.log("⚠️ Firebase not loaded (using fallback data)");
}

// 🔥 Always keep fallback ready
const crowdDataFallback = require("../data/crowdData");

const { getAIResponse } = require("../services/aiService");

router.post("/ask", async (req, res) => {
  const { query, history = [] } = req.body;

  try {
    let crowdData = null;

    // 🔥 If Firebase exists → use it
    if (db && db.collection) {
      try {
        const doc = await db.collection("crowd").doc("stadium").get();

        if (doc.exists) {
          crowdData = doc.data();
        } else {
          console.log("⚠️ Firebase doc missing, using fallback");
          crowdData = crowdDataFallback;
        }
      } catch (err) {
        console.log("⚠️ Firebase error, using fallback");
        crowdData = crowdDataFallback;
      }
    } else {
      // 🔥 No Firebase → fallback
      crowdData = crowdDataFallback;
    }

    // 🔥 AI response
    const aiAnswer = await getAIResponse(query, crowdData, history);

    res.json({ answer: aiAnswer });

  } catch (error) {
    console.error("ERROR:", error.message);

    // 🔥 Final fallback response (never crash UI)
    res.json({
      answer: "Based on current data, Gate A is a good option. Please try again."
    });
  }
});

module.exports = router;