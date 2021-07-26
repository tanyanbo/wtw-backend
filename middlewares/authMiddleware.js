const authMiddleware = (req, res, next) => {
  if (!req.header("Authorization")) {
    res.status(403).json({
      status: "fail",
      message: "Please provide your access token",
    });
  }
  const token = req.header("Authorization").replace("Bearer ", "");
};

module.exports = authMiddleware;
