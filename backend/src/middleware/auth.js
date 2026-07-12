const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

/**
 * Verifies the Bearer JWT and attaches the current user to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized: missing token");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401);
    throw new Error("Not authorized: invalid or expired token");
  }

  const user = await User.findById(decoded.id).select("-password");
  if (!user || !user.isActive) {
    res.status(401);
    throw new Error("Not authorized: user not found or disabled");
  }

  req.user = user;
  next();
});

module.exports = { protect };