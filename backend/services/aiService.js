/*
const { HfInference } = require("@huggingface/inference");

const HF_API_KEY = process.env.HF_API_KEY
  ? process.env.HF_API_KEY.replace(/['"]+/g, '').trim()
  : null;

const hf = new HfInference(HF_API_KEY);

async function getAIResponse(query, crowdData, history = []) {
  try {
    if (!HF_API_KEY) throw new Error("HF_API_KEY missing.");

    console.log("Calling Qwen with memory...");

    const lower = query.toLowerCase();

    // 🔥 STEP 1: Handle seat navigation BEFORE AI call
    if (lower.includes("seat") || lower.includes("section")) {
      const userGate = "A"; // 🔥 Simulated user position (can be dynamic later)

      const seatMatch = query.match(/[A-C][1-2]/);

      if (seatMatch) {
        return getSeatDirections(userGate, seatMatch[0], crowdData);
      }
    }

    // 🔥 STEP 2: AI response
    const messages = [
      {
        role: "system",
        content:
          "You are CrowdIQ, a real-time stadium assistant. Always prioritize the latest crowd data. If conditions change, give updated recommendations."
      },

      ...history,

      {
        role: "user",
        content: `Crowd Data: ${JSON.stringify(crowdData)}. Question: ${query}`
      }
    ];

    const response = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages,
      max_tokens: 150,
      temperature: 0.6
    });

    if (response.choices && response.choices[0].message) {
      console.log("✅ Success with Qwen + Memory!");
      return response.choices[0].message.content;
    }

    return "The assistant is currently occupied. Please check the gate monitors.";

  } catch (error) {
    console.error("--- HF API ERROR ---");
    console.error("Message:", error.message);

    return generateFallback(query, crowdData);
  }
}

//
// 🔥 HELPER: Seat Navigation Logic
//
function getSeatDirections(userGate, seatSection, crowdData) {
  const section = crowdData.sections[seatSection];

  if (!section) {
    return "Invalid seat section. Please check your ticket.";
  }

  const targetGate = section.nearGate;

  if (userGate === targetGate) {
    return `You are near Gate ${userGate}. Proceed directly to Section ${seatSection}.`;
  }

  return `Your seat is in Section ${seatSection} near Gate ${targetGate}. Walk towards Gate ${targetGate} and follow stadium signs.`;
}

//
// 🔥 FALLBACK LOGIC (enhanced with seats)
//
function generateFallback(query, crowdData) {
  const lower = query.toLowerCase();

  // Gate recommendation
  if (lower.includes("gate")) {
    let best = null;
    let min = Infinity;

    for (let g in crowdData.gates) {
      if (crowdData.gates[g].waitTime < min) {
        min = crowdData.gates[g].waitTime;
        best = g;
      }
    }

    return `Gate ${best} is the fastest with ${min} minutes wait time.`;
  }

  // Food recommendation
  if (lower.includes("food") || lower.includes("stall")) {
    let best = null;
    let min = Infinity;

    for (let s in crowdData.stalls) {
      if (crowdData.stalls[s].waitTime < min) {
        min = crowdData.stalls[s].waitTime;
        best = s;
      }
    }

    return `Stall ${best} has the shortest wait time (${min} mins).`;
  }

  // 🔥 Seat fallback
  if (lower.includes("seat") || lower.includes("section")) {
    const seatMatch = query.match(/[A-C][1-2]/);

    if (seatMatch) {
      return `Section ${seatMatch[0]} is inside the stadium. Follow the nearest gate signage to reach it.`;
    }
  }

  return "Ask about gates, food stalls, or seat directions for assistance.";
}

module.exports = { getAIResponse };
*/
const axios = require("axios");

const HF_API_KEY = process.env.HF_API_KEY;

// 🔥 Smart fallback (rule-based)
function fallbackResponse(query, crowdData) {
  const gates = crowdData.gates;

  let bestGate = null;
  let minWait = Infinity;

  for (let g in gates) {
    if (gates[g].waitTime < minWait) {
      minWait = gates[g].waitTime;
      bestGate = g;
    }
  }

  if (query.toLowerCase().includes("fastest")) {
    return `Gate ${bestGate} is the fastest with a wait time of ${minWait} minutes.`;
  }

  return "You can choose Gate " + bestGate + " for quicker entry.";
}

// 🔥 Main AI function
async function getAIResponse(query, crowdData, history) {
  try {
    if (!HF_API_KEY) {
      console.log("⚠️ No HF key, using fallback");
      return fallbackResponse(query, crowdData);
    }

    const prompt = `
You are a stadium assistant.
Crowd data: ${JSON.stringify(crowdData)}
User: ${query}
Answer briefly:
`;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`
        }
      }
    );

    if (response.data && response.data[0]?.generated_text) {
      return response.data[0].generated_text;
    }

    // fallback if HF returns weird format
    return fallbackResponse(query, crowdData);

  } catch (error) {
    console.error("HF ERROR:", error.message);

    // 🔥 ALWAYS fallback
    return fallbackResponse(query, crowdData);
  }
}

module.exports = { getAIResponse };