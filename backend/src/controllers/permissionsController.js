const asyncHandler = require("express-async-handler");
const { ROLES, MODULES, permissionsForRole } = require("../permissions/permissions");

// Public: full permission matrix for every role, so the frontend can compute
// `can(module, action)` locally the instant the role switcher changes.
const matrix = asyncHandler(async (req, res) => {
  const result = {};
  for (const role of ROLES) {
    result[role] = permissionsForRole(role);
  }
  res.json({ roles: ROLES, modules: MODULES, matrix: result });
});

module.exports = { matrix };
