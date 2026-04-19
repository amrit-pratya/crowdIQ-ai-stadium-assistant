const crowdData = {
  gates: {
    A: { waitTime: 5, congestion: 40 },
    B: { waitTime: 8, congestion: 60 },
    C: { waitTime: 2, congestion: 30 }
  },

  stalls: {
    food1: { waitTime: 6 },
    food2: { waitTime: 3 },
    food3: { waitTime: 7 }
  },

  // 🔥 NEW: Seating sections mapped to nearest gates
  sections: {
    A1: { nearGate: "A" },
    A2: { nearGate: "A" },
    B1: { nearGate: "B" },
    B2: { nearGate: "B" },
    C1: { nearGate: "C" },
    C2: { nearGate: "C" }
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
  const isPeak = phase % 20 > 10; // pseudo peak traffic

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