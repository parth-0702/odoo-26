const express = require("express");
const demoAuth = require("../middleware/demoAuth");
const { authorize } = require("../middleware/rbac");
const ctrl = require("../controllers/vehicleController");

const router = express.Router();
router.use(demoAuth);

router.get("/", authorize("vehicle", "read"), ctrl.list);
router.get("/:id", authorize("vehicle", "read"), ctrl.getOne);
router.post("/", authorize("vehicle", "create"), ctrl.create);
router.put("/:id", authorize("vehicle", "update"), ctrl.update);
router.delete("/:id", authorize("vehicle", "delete"), ctrl.remove);

module.exports = router;
