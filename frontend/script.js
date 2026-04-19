const messagesDiv = document.getElementById("messages");
let chatHistory = [];

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
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
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

  // 🔥 Animated thinking
  const botDiv = addMessage(
    `CrowdIQ is thinking <span class="dots"><span>.</span><span>.</span><span>.</span></span>`,
    "bot"
  );

  const start = Date.now();

  const res = await fetch("http://localhost:5000/assistant/ask", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ query, history: chatHistory })
  });

  const data = await res.json();

  // 🔥 Ensure minimum thinking delay
  const elapsed = Date.now() - start;
  if (elapsed < 600) {
    await new Promise(r => setTimeout(r, 600 - elapsed));
  }

  const text = formatResponse(data.answer);

  // 🔥 Replace typing text
  botDiv.innerText = "";

  let i = 0;
  const interval = setInterval(() => {
    botDiv.innerText = text.slice(0, i + 1);
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 20);

  chatHistory.push({ role: "assistant", content: text });

  // 🔥 Detect seat query → update map
  const map = document.getElementById("map");

  // 🔥 Detect seat query robustly
  const seatMatch = query.toUpperCase().match(/[A-C]\s?[1-2]/);

  if (seatMatch) {
    const cleanSeat = seatMatch[0].replace(" ", "");
    renderMap("A", cleanSeat);
  } else {
    map.style.display = "none"; // 🔥 hide map if not seat query
  }

  if (seatMatch) {
    const cleanSeat = seatMatch[0].replace(" ", "");
    renderMap("A", cleanSeat);
  }
}

// ===============================
// 🗺️ MAP LOGIC
// ===============================

function renderMap(userGate = "A", targetSection = null) {
  const map = document.getElementById("map");
  if (!map) return;

  // 🔥 SHOW map only when needed
  map.style.display = "block";

  map.innerHTML = "";

  const gates = {
    A: { top: "10%", left: "10%" },
    B: { top: "10%", left: "45%" },
    C: { top: "10%", left: "80%" }
  };

  const sections = {
    A1: { top: "60%", left: "10%" },
    A2: { top: "75%", left: "10%" },
    B1: { top: "60%", left: "45%" },
    B2: { top: "75%", left: "45%" },
    C1: { top: "60%", left: "80%" },
    C2: { top: "75%", left: "80%" }
  };

  for (let g in gates) {
    const div = document.createElement("div");
    div.className = "gate";
    div.innerText = "Gate " + g;
    div.style.top = gates[g].top;
    div.style.left = gates[g].left;

    if (g === userGate) div.classList.add("highlight");

    map.appendChild(div);
  }

  for (let s in sections) {
    const div = document.createElement("div");
    div.className = "section";
    div.innerText = s;
    div.style.top = sections[s].top;
    div.style.left = sections[s].left;

    if (s === targetSection) div.classList.add("highlight");

    map.appendChild(div);
  }

  const user = document.createElement("div");
  user.className = "user-dot";
  user.style.top = gates[userGate].top;
  user.style.left = gates[userGate].left;

  map.appendChild(user);
}