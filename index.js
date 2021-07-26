// require("dotenv").config({ path: `${__dirname}/config.env` });
const express = require("express");
const app = express();

const { signInOrRegister, signOut } = require("./functions/auth");
const authMiddleware = require("./middlewares/authMiddleware");
const addNickname = require("./functions/addNickname");
const getWish = require("./functions/getWish");
const createWish = require("./functions/createWish");
const updateWish = require("./functions/updateWish");

app.use(express.json());

app.post("/signin", signInOrRegister);
app.get("/signout", authMiddleware, signOut);
app.post("/nickname", authMiddleware, addNickname);

app.get("/wish", authMiddleware, getWish);
app.post("/wish", authMiddleware, createWish);
app.put("/wish", authMiddleware, updateWish);

// Global error handling middleware
app.use((err, req, res, _) => {
  res.status(err.status ?? 401).json({
    status: "Fail",
    message: err.message ?? "from global error handling middleware",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);
