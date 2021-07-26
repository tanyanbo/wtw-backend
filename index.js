// require("dotenv").config({ path: `${__dirname}/config.env` });
const express = require("express");
const app = express();

const { signInOrRegister, signOut } = require("./functions/auth");
const authMiddleware = require("./middlewares/authMiddleware");
const db = require("./firebase/firestore");
const addNickname = require("./functions/addNickname");

app.use(express.json());

app.get("/", authMiddleware, (req, res) => {
  res.send(`The user's id is: ${req.body.id}`);
});

app.post("/signin", signInOrRegister);
app.post("/nickname", authMiddleware, addNickname);
app.get("/signout", authMiddleware, signOut);

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
app.use((err, req, res, _) => {
  res.status(err.status ?? 401).json({
    status: "Fail",
    message: err.message ?? "from global error handling middleware",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);
