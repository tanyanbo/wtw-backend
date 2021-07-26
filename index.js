require("dotenv").config({ path: `${__dirname}/config.env` });
const express = require("express");
const app = express();
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const db = admin.firestore();

app.use(express.json());

const authMiddleware = require("./middlewares/authMiddleware");

app.get("/", authMiddleware, (req, res) => {
  res.send("Hello world");
});

app.post("/signin", async (req, res) => {
  const { phone, code } = req.body;
  try {
    const users = await db
      .collection("users")
      .where("phone", "==", phone)
      .get();

    let dbCode;
    let id;

    users.forEach((doc) => {
      id = doc.id;
      dbCode = doc.data().code;
    });

    if (!users.empty) {
      // user exists
      const isMatch = await bcrypt.compare(code, dbCode);

      if (isMatch) {
        // code is correct
        const token = jwt.sign({ id }, process.env.JWT_PRIVATE_KEY, {
          expiresIn: "7 days",
        });

        await db.collection("users").doc(id).update({ token });

        res.status(200).json({
          status: "success",
          message: `Id of new user: ${id}`,
          accessToken: token,
        });
      } else {
        // code is incorrect
        res.status(401).json({
          status: "fail",
          message: "Incorrect phone number or verification code",
        });
      }
    } else {
      // user does not exist
      const hashedCode = await bcrypt.hash(code, 12);

      const newUser = await db.collection("users").add({
        phone,
        code: hashedCode,
      });

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_PRIVATE_KEY, {
        expiresIn: "7 days",
      });

      await newUser.update({ token });

      res.status(200).json({
        status: "success",
        message: `Id of new user: ${newUser.id}`,
        accessToken: token,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "fail",
      message: "Failed to sign in",
    });
  }
});

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

const PORT = process.env.PORT || 5000;

app.listen(PORT);
