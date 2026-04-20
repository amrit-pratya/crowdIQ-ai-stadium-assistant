const axios = require("axios");

const HF_API_KEY = process.env.HF_API_KEY;

// ===============================
// 🔥 FALLBACK (ALWAYS SAFE)
// ===============================
function fallbackResponse(query, crowdData) {
  const lower = query.toLowerCase();

  // 🔹 Fastest gate
  if (lower.includes("gate") || lower.includes("fastest")) {
    let best = null;
    let min = Infinity;

    for (let g in crowdData.gates) {
      if (crowdData.gates[g].waitTime < min) {
        min = crowdData.gates[g].waitTime;
        best = g;
      }
    }

    return `Based on current crowd data, Gate ${best} is the fastest with a wait time of ${min} minutes.`;
  }

  // 🔹 Seat detection
  const seatMatch = query.toUpperCase().match(/[A-C][1-2]/);
  if (seatMatch) {
    const section = seatMatch[0];
    const data = crowdData.sections[section];

    if (data) {
      return `Section ${section} is near Gate ${data.nearGate}. Follow the signs inside the stadium.`;
    }
  }

  // 🔹 Food
  if (lower.includes("food") || lower.includes("stall")) {
    let best = null;
    let min = Infinity;

    for (let s in crowdData.stalls) {
      if (crowdData.stalls[s].waitTime < min) {
        min = crowdData.stalls[s].waitTime;
        best = s;
      }
    }

    return `Stall ${best} has the shortest wait time (${min} minutes).`;
  }

  return "Ask about gates, seats, or food stalls for assistance.";
}

// ===============================
// 🤖 QWEN AI FUNCTION
// ===============================
async function getAIResponse(query, crowdData, history = []) {
  try {
    if (!HF_API_KEY) {
      console.log("⚠️ No HF key → fallback");
      return fallbackResponse(query, crowdData);
    }

    const prompt = `
You are CrowdIQ, a smart stadium assistant.

Use the data below to answer clearly and naturally.

Crowd Data:
${JSON.stringify(crowdData)}

User Question:
${query}

Give a short, helpful answer.
`;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-1.5B-Instruct",
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 120,
          temperature: 0.7
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("HF RAW RESPONSE:", response.data);

    // ✅ Safe response parsing
    if (
      Array.isArray(response.data) &&
      response.data[0] &&
      response.data[0].generated_text
    ) {
      return response.data[0].generated_text;
    }

    // ⚠️ Model loading or weird response
    console.log("⚠️ HF returned unexpected format → fallback");
    return fallbackResponse(query, crowdData);

  } catch (error) {
    console.error("❌ HF ERROR:", error.message);

    // 🔥 Always fallback
    return fallbackResponse(query, crowdData);
  }
}

module.exports = { getAIResponse };