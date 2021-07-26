require("dotenv").config({ path: `${__dirname}/config.env` });
const express = require("express");
const app = express();
const admin = require("firebase-admin");

const { signInOrRegister } = require("./functions/auth");
const authMiddleware = require("./middlewares/authMiddleware");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const db = admin.firestore();

app.use(express.json());

app.get("/", authMiddleware, (req, res) => {
  res.send(`The user's id is: ${req.body.id}`);
});

app.post("/signin", signInOrRegister);

app.get("/getusers", async (req, res) => {
  try {
    const users = await db.collection("users").get();
    res.send(users.docs[0]);
  } catch (e) {
    res.send(e);
  }
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
      res.send(e);
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  res.status(401).json({
    status: "fail",
    message: "from global error handling middleware",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);
