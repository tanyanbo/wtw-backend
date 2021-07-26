const jwt = require("jsonwebtoken");
const db = require("../firebase/firestore");

const authMiddleware = (req, res, next) => {
  if (!req.header("Authorization")) {
    res.status(401).json({
      status: "fail",
      message: "Please provide your access token",
    });
  }

  const token = req.header("Authorization").replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
    if (err) {
      err.status = 401;
      err.message = "You are not authenticated";
      next(err);
    }
    db.collection("users")
      .doc(decoded.id)
      .get()
      .then((user) => {
        if (user.data().token === token) {
          req.body.id = decoded.id;
          req.body.userNickname = user.data().nickname;
          req.body.coins = user.data().coins;
          next();
        } else {
          res.status(401).json({
            status: "Fail",
            message: "You are not authenticated",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          status: "Fail",
          message: "Internal server error",
        });
      });
  });
};

module.exports = authMiddleware;
