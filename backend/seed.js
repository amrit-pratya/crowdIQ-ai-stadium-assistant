const admin = require("firebase-admin");
const serviceAccount = require("./firebaseKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seed() {
  await db.collection("crowd").doc("stadium").set({
    gates: {
      A: { waitTime: 5, congestion: 40 },
      B: { waitTime: 8, congestion: 60 },
      C: { waitTime: 2, congestion: 30 },
    },
    stalls: {
      food1: { waitTime: 6 },
      food2: { waitTime: 3 },
      food3: { waitTime: 7 },
    },
    sections: {
      A1: { nearGate: "A" },
      A2: { nearGate: "A" },
      B1: { nearGate: "B" },
      B2: { nearGate: "B" },
      C1: { nearGate: "C" },
      C2: { nearGate: "C" },
    },
  });

  console.log("🔥 Data uploaded successfully!");
}

seed();