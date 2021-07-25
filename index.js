const express = require("express");
const app = express();
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const db = admin.firestore();

app.get("/postacc", async (req, res) => {
  try {
    await db.collection("users").add({
      name: "ybfrompath",
      email: "path@email.com",
    });
  } catch (e) {
    res.send("an error occurred");
  }
  res.send("Successfully added to database");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);
