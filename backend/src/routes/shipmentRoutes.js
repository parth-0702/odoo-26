const express = require("express");
const demoAuth = require("../middleware/demoAuth");
const { authorize } = require("../middleware/rbac");
const ctrl = require("../controllers/shipmentController");

const router = express.Router();
router.use(demoAuth);

router.get("/", authorize("shipment", "read"), ctrl.list);
router.get("/:id", authorize("shipment", "read"), ctrl.getOne);
router.post("/", authorize("shipment", "create"), ctrl.create);
router.put("/:id", authorize("shipment", "update"), ctrl.update);
router.delete("/:id", authorize("shipment", "delete"), ctrl.remove);

module.exports = router;
