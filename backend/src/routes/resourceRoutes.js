const express = require("express");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");
const crudFactory = require("../utils/crudFactory");

/**
 * Builds a standard RBAC-protected CRUD router for a Mongoose model.
 * resource: the permission key (e.g. "vehicle")
 */
function buildResourceRouter(Model, resource, options = {}) {
  const c = crudFactory(Model, options);
  const router = express.Router();
  router.use(protect);

  router.get("/", authorize(resource, "read"), c.list);
  router.get("/:id", authorize(resource, "read"), c.getOne);
  router.post("/", authorize(resource, "create"), c.create);
  router.put("/:id", authorize(resource, "update"), c.update);
  router.delete("/:id", authorize(resource, "delete"), c.remove);

  return router;
}

module.exports = buildResourceRouter;