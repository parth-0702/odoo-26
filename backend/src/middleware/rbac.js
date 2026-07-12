const { can } = require("../config/permissions");

/**
 * Route guard factory. Usage: router.get("/", protect, authorize("vehicle", "read"), ctrl)
 * Relies on req.user (set by protect). Denies with 403 when the role lacks the
 * requested resource/action permission.
 */
function authorize(resource, action) {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error("Not authorized"));
    }
    if (!can(req.user.role, resource, action)) {
      res.status(403);
      return next(
        new Error(`Forbidden: '${req.user.role}' cannot ${action} ${resource}`)
      );
    }
    next();
  };
}

module.exports = { authorize };