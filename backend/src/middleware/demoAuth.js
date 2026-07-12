const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { ROLES } = require("../permissions/permissions");

/**
 * There is no real login flow yet. The frontend's role switcher sends who it
 * is acting as via the `x-demo-user` header (a User _id). We look that user
 * up and trust its role. Falls back to `x-demo-role` for quick testing
 * (curl/Postman) without a seeded user id.
 *
 * Swap this middleware out for real JWT auth later without touching any of
 * the RBAC/controller code — everything downstream only cares about
 * `req.user.role`.
 */
const demoAuth = asyncHandler(async (req, res, next) => {
  const userId = req.header("x-demo-user");
  const roleHeader = req.header("x-demo-role");

  if (userId) {
    const user = await User.findById(userId).lean();
    if (!user || !user.active) {
      res.status(401);
      throw new Error("Unknown or inactive demo user. Re-select a role.");
    }
    req.user = { id: user._id, name: user.name, role: user.role };
    return next();
  }

  if (roleHeader && ROLES.includes(roleHeader)) {
    req.user = { id: null, name: `${roleHeader} (no user record)`, role: roleHeader };
    return next();
  }

  res.status(401);
  throw new Error(
    "Missing demo identity. Send an 'x-demo-user' (seeded user id) or 'x-demo-role' header."
  );
});

module.exports = demoAuth;
