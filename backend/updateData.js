const admin = require("firebase-admin");
const serviceAccount = require("./firebaseKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

setInterval(async () => {
  const newData = {
    gates: {
      A: {
        waitTime: Math.floor(Math.random() * 10) + 1,
        congestion: Math.floor(Math.random() * 100),
      },
      B: {
        waitTime: Math.floor(Math.random() * 10) + 1,
        congestion: Math.floor(Math.random() * 100),
      },
      C: {
        waitTime: Math.floor(Math.random() * 10) + 1,
        congestion: Math.floor(Math.random() * 100),
      },
    },
  };

  await db.collection("crowd").doc("stadium").update(newData);

  console.log("🔥 Firebase updated:", newData);

}, 5000);