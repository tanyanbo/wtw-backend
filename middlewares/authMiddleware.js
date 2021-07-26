const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  if (!req.header("Authorization")) {
    res.status(403).json({
      status: "fail",
      message: "Please provide your access token",
    });
  }

  const token = req.header("Authorization").replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
    if (err) {
      next(err);
    }
    req.body.id = decoded.id;
    next();
  });
};

module.exports = authMiddleware;
