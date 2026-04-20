const crowdData = {
  gates: {
    A: {
      waitTime: 5,
      congestion: 40,
      sections: ["A1", "A2"],
      distance: "near main entrance",
      foodNearby: ["Snacks Stall", "Drinks Corner"]
    },
    B: {
      waitTime: 8,
      congestion: 60,
      sections: ["B1", "B2"],
      distance: "center entrance",
      foodNearby: ["Burger Hub", "Pizza Point"]
    },
    C: {
      waitTime: 2,
      congestion: 30,
      sections: ["C1", "C2"],
      distance: "parking side",
      foodNearby: ["Juice Bar", "Ice Cream"]
    }
  },

  stalls: {
    food1: { name: "Burger Hub", waitTime: 6, gate: "B", rating: 4.5 },
    food2: { name: "Pizza Point", waitTime: 3, gate: "B", rating: 4.2 },
    food3: { name: "Juice Bar", waitTime: 7, gate: "C", rating: 4.0 },
    food4: { name: "Snacks Stall", waitTime: 5, gate: "A", rating: 3.8 }
  },

  sections: {
    A1: { nearGate: "A", level: "Lower", row: "Front" },
    A2: { nearGate: "A", level: "Upper", row: "Back" },
    B1: { nearGate: "B", level: "Lower", row: "Middle" },
    B2: { nearGate: "B", level: "Upper", row: "Back" },
    C1: { nearGate: "C", level: "Lower", row: "Front" },
    C2: { nearGate: "C", level: "Upper", row: "Back" }
  }
};

// 🔥 Smooth fluctuation helper
function fluctuate(value, min, max, step = 2) {
  const change = Math.floor(Math.random() * step * 2) - step;
  let newValue = value + change;

  if (newValue < min) newValue = min;
  if (newValue > max) newValue = max;

  return newValue;
}

// 🔥 Simulate real-time updates every 5 seconds
setInterval(() => {
  const phase = new Date().getSeconds();
  const isPeak = phase % 20 > 10;

  // Gates
  for (let gate in crowdData.gates) {
    const g = crowdData.gates[gate];

    g.waitTime = fluctuate(
      g.waitTime,
      isPeak ? 5 : 1,
      isPeak ? 15 : 10
    );

    g.congestion = fluctuate(
      g.congestion,
      isPeak ? 50 : 20,
      100
    );
  }

  // Food stalls
  for (let stall in crowdData.stalls) {
    const s = crowdData.stalls[stall];

    s.waitTime = fluctuate(
      s.waitTime,
      isPeak ? 4 : 1,
      isPeak ? 12 : 8
    );
  }

  console.log(
    `🔄 Crowd updated (${isPeak ? "PEAK" : "NORMAL"}):`,
    JSON.stringify(crowdData, null, 2)
  );

}, 5000);

module.exports = crowdData;