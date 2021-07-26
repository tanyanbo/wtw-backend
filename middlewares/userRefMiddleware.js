const db = require("../firebase/firestore");

const userRefMiddleware = async (req, res, next) => {
  req.body.userRef = await db.collection("users").doc(req.body.id);
  next();
};

module.exports = userRefMiddleware();
