const express = require("express");

const authMiddleware = (req, res, next) => {
  if (!req.body.token) {
    res.status(403).json({
      status: "fail",
      message: "Please provide your access token",
    });
  }
};

export default authMiddleware;
