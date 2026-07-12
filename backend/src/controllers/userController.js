const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { permissionsForRole } = require("../permissions/permissions");

// Lists active demo identities (id/name/role only) for the frontend role switcher.
const list = asyncHandler(async (req, res) => {
  const users = await User.find({ active: true }).select("name email role").sort({ role: 1 });
  res.json(users);
});

// Returns the profile + computed permissions for whoever is currently "logged in".
const me = asyncHandler(async (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    role: req.user.role,
    permissions: permissionsForRole(req.user.role),
  });
});

module.exports = { list, me };
