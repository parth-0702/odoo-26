const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { DEMO_ACCOUNTS } = require("../config/demoAuth");

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error("A user with that email already exists");
  }
  const user = await User.create({ name, email, password, role });
  res.status(201).json({
    data: sanitize(user),
    token: generateToken(user),
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  let user = await User.findOne({ email }).select("+password");

  if (!user && role && process.env.NODE_ENV !== "production" && DEMO_ACCOUNTS[role]) {
    const demo = DEMO_ACCOUNTS[role];
    user = await User.findOne({ email: demo.email }).select("+password");
    if (!user) {
      user = await User.create({
        name: demo.name,
        email: demo.email,
        password: demo.password,
        role,
      });
      user = await User.findById(user._id).select("+password");
    } else {
      user.name = demo.name;
      user.role = role;
      user.password = demo.password;
      await user.save();
      user = await User.findById(user._id).select("+password");
    }
  }

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  user.lastLoginAt = new Date();
  await user.save();
  res.json({ data: sanitize(user), token: generateToken(user) });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  res.json({ data: req.user });
});

function sanitize(user) {
  const obj = user.toObject();
  delete obj.password;
  return obj;
}

module.exports = { register, login, me };