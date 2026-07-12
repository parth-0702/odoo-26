const express = require("express");
const demoAuth = require("../middleware/demoAuth");
const { authorize } = require("../middleware/rbac");
const ctrl = require("../controllers/driverController");

const router = express.Router();
router.use(demoAuth);

router.get("/", authorize("driver", "read"), ctrl.list);
router.get("/:id", authorize("driver", "read"), ctrl.getOne);
router.post("/", authorize("driver", "create"), ctrl.create);
router.put("/:id", authorize("driver", "update"), ctrl.update);
router.delete("/:id", authorize("driver", "delete"), ctrl.remove);

module.exports = router;
