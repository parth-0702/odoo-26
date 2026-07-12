const express = require("express");
const demoAuth = require("../middleware/demoAuth");
const { authorize } = require("../middleware/rbac");
const ctrl = require("../controllers/routeController");

const router = express.Router();
router.use(demoAuth);

router.get("/", authorize("route", "read"), ctrl.list);
router.get("/:id", authorize("route", "read"), ctrl.getOne);
router.post("/", authorize("route", "create"), ctrl.create);
router.put("/:id", authorize("route", "update"), ctrl.update);
router.delete("/:id", authorize("route", "delete"), ctrl.remove);

module.exports = router;
