// require("dotenv").config({ path: `${__dirname}/config.env` });
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

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/postacc", (req, res) => {
  db.collection("users")
    .add({
      name: "TESTUSER",
      email: "TESTING@EMAIL.COM",
    })
    .then((_) => {
      res.send("Successfully added to database");
    })
    .catch((e) => {
      res.send("An error occured");
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);
