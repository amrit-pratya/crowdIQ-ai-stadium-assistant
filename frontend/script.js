/*
const messagesDiv = document.getElementById("messages");
let chatHistory = [];

let map;
let markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 12.9716, lng: 77.5946 }, // any central point
    zoom: 17,
  });
}

// 🔥 Toggle profile menu
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// 🔥 Add message to UI
function addMessage(html, sender) {
  const div = document.createElement("div");
  div.className = "message " + sender;
  div.innerHTML = html;
  messagesDiv.appendChild(div);

  messagesDiv.scrollTo({
    top: messagesDiv.scrollHeight,
    behavior: "smooth"
  });

  return div;
}

// 🔥 Clean formatting
function formatResponse(text) {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/(\d)([a-zA-Z])/g, "$1 $2")
    .replace(/\./g, ". ");
}

// 🔥 MAIN: Send message
async function sendMessage() {
  const input = document.getElementById("query");
  const query = input.value;

  if (!query) return;

  addMessage(query, "user");
  chatHistory.push({ role: "user", content: query });

  input.value = "";

  const botDiv = addMessage(
    `CrowdIQ is thinking <span class="dots"><span>.</span><span>.</span><span>.</span></span>`,
    "bot"
  );

  const start = Date.now();

  const res = await fetch("http://localhost:5000/assistant/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, history: chatHistory })
  });

  const data = await res.json();

  const elapsed = Date.now() - start;
  if (elapsed < 600) {
    await new Promise(r => setTimeout(r, 600 - elapsed));
  }

  const text = formatResponse(data.answer);

  botDiv.innerText = "";

  let i = 0;
  const interval = setInterval(() => {
    botDiv.innerText = text.slice(0, i + 1);
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 20);

  chatHistory.push({ role: "assistant", content: text });

  // 🔥 Seat detection
  const map = document.getElementById("map");
  const seatMatch = query.toUpperCase().match(/[A-C]\s?[1-2]/);

  if (seatMatch) {
    const cleanSeat = seatMatch[0].replace(" ", "");
    renderMap("A", cleanSeat);
  } else {
    map.style.display = "none";
  }
}

// ===============================
// 🗺️ MAP RENDER (STATIC LAYOUT)
// ===============================

function renderMap(userGate = "A", targetSection = null) {
  const mapDiv = document.getElementById("map");
  mapDiv.style.display = "block";

  if (!map) return;

  // Clear old markers
  markers.forEach(m => m.setMap(null));
  markers = [];

  const gateCoords = {
    A: { lat: 12.9718, lng: 77.5944 },
    B: { lat: 12.9716, lng: 77.5948 },
    C: { lat: 12.9714, lng: 77.5952 }
  };

  const sectionCoords = {
    A1: { lat: 12.9719, lng: 77.5943 },
    A2: { lat: 12.9720, lng: 77.5942 },
    B1: { lat: 12.9716, lng: 77.5949 },
    B2: { lat: 12.9715, lng: 77.5950 },
    C1: { lat: 12.9713, lng: 77.5953 },
    C2: { lat: 12.9712, lng: 77.5954 }
  };

  // Gates
  for (let g in gateCoords) {
    const marker = new google.maps.Marker({
      position: gateCoords[g],
      map,
      label: "Gate " + g,
      icon: g === userGate
        ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        : null
    });
    markers.push(marker);
  }

  // Target section
  if (targetSection && sectionCoords[targetSection]) {
    const marker = new google.maps.Marker({
      position: sectionCoords[targetSection],
      map,
      label: targetSection,
      icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
    });
    markers.push(marker);

    map.panTo(sectionCoords[targetSection]);
  }
}

// ===============================
// 🔥 REAL-TIME UPDATE (FIREBASE)
// ===============================

async function fetchLiveData() {
  try {
    // const res = await fetch("http://localhost:5000/crowd");
    const res = await fetch("https://crowdiq-backend.onrender.com/assistant/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: query,
        history: chatHistory
      })
    });
    const data = await res.json();

    updateMap(data);
  } catch (err) {
    console.error("Live update error:", err);
  }
}

// 🔥 Update map dynamically
function updateMap(data) {
  if (!data || !data.gates) return;

  let bestGate = null;
  let min = Infinity;

  for (let g in data.gates) {
    if (data.gates[g].waitTime < min) {
      min = data.gates[g].waitTime;
      bestGate = g;
    }
  }

  // Remove old highlights
  document.querySelectorAll(".gate").forEach(g => {
    g.classList.remove("best");
  });

  // Highlight best gate
  const el = document.getElementById("gate-" + bestGate);
  if (el) el.classList.add("best");
}

// 🔥 Start real-time polling
document.addEventListener("DOMContentLoaded", () => {
  setInterval(fetchLiveData, 5000);
});
*/

const messagesDiv = document.getElementById("messages");
let chatHistory = [];

let map;
let markers = [];

// 🔥 LIVE BACKEND URL
const API_BASE = "https://crowdiq-backend.onrender.com";

// ===============================
// 🗺️ GOOGLE MAP INIT
// ===============================
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 12.9716, lng: 77.5946 },
    zoom: 17,
  });
}

// ===============================
// UI HELPERS
// ===============================
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function addMessage(html, sender) {
  const div = document.createElement("div");
  div.className = "message " + sender;
  div.innerHTML = html;
  messagesDiv.appendChild(div);

  messagesDiv.scrollTo({
    top: messagesDiv.scrollHeight,
    behavior: "smooth"
  });

  return div;
}

function formatResponse(text) {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/(\d)([a-zA-Z])/g, "$1 $2")
    .replace(/\./g, ". ");
}

// ===============================
// 💬 SEND MESSAGE
// ===============================
async function sendMessage() {
  const input = document.getElementById("query");
  const query = input.value;

  if (!query) return;

  addMessage(query, "user");
  chatHistory.push({ role: "user", content: query });

  input.value = "";

  const botDiv = addMessage(
    `CrowdIQ is thinking <span class="dots"><span>.</span><span>.</span><span>.</span></span>`,
    "bot"
  );

  try {
    const res = await fetch(`${API_BASE}/assistant/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        history: chatHistory
      })
    });

    const data = await res.json();

    const text = formatResponse(data.answer || "No response");

    botDiv.innerText = "";

    let i = 0;
    const interval = setInterval(() => {
      botDiv.innerText = text.slice(0, i + 1);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 20);

    chatHistory.push({ role: "assistant", content: text });

  } catch (err) {
    console.error(err);
    botDiv.innerText = "⚠️ Server error. Please try again.";
  }

  // 🔥 Seat detection
  const mapDiv = document.getElementById("map");
  const seatMatch = query.toUpperCase().match(/[A-C]\s?[1-2]/);

  if (seatMatch) {
    const cleanSeat = seatMatch[0].replace(" ", "");
    renderMap("A", cleanSeat);
  } else {
    mapDiv.style.display = "none";
  }
}

// ===============================
// 🗺️ MAP RENDER
// ===============================
function renderMap(userGate = "A", targetSection = null) {
  const mapDiv = document.getElementById("map");
  mapDiv.style.display = "block";

  if (!map) return;

  markers.forEach(m => m.setMap(null));
  markers = [];

  const gateCoords = {
    A: { lat: 12.9718, lng: 77.5944 },
    B: { lat: 12.9716, lng: 77.5948 },
    C: { lat: 12.9714, lng: 77.5952 }
  };

  const sectionCoords = {
    A1: { lat: 12.9719, lng: 77.5943 },
    A2: { lat: 12.9720, lng: 77.5942 },
    B1: { lat: 12.9716, lng: 77.5949 },
    B2: { lat: 12.9715, lng: 77.5950 },
    C1: { lat: 12.9713, lng: 77.5953 },
    C2: { lat: 12.9712, lng: 77.5954 }
  };

  // Gates
  for (let g in gateCoords) {
    const marker = new google.maps.Marker({
      position: gateCoords[g],
      map,
      label: "Gate " + g,
      icon: g === userGate
        ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        : null
    });
    markers.push(marker);
  }

  // Target section
  if (targetSection && sectionCoords[targetSection]) {
    const marker = new google.maps.Marker({
      position: sectionCoords[targetSection],
      map,
      label: targetSection,
      icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
    });
    markers.push(marker);

    map.panTo(sectionCoords[targetSection]);
  }
}

// ===============================
// 🔥 REAL-TIME DATA (FIXED)
// ===============================
async function fetchLiveData() {
  try {
    const res = await fetch(`${API_BASE}/crowd`);
    const data = await res.json();

    updateMap(data);
  } catch (err) {
    console.error("Live update error:", err);
  }
}

function updateMap(data) {
  if (!data || !data.gates) return;

  let bestGate = null;
  let min = Infinity;

  for (let g in data.gates) {
    if (data.gates[g].waitTime < min) {
      min = data.gates[g].waitTime;
      bestGate = g;
    }
  }

  console.log("Best Gate:", bestGate);
}

// Start polling
document.addEventListener("DOMContentLoaded", () => {
  setInterval(fetchLiveData, 5000);
});