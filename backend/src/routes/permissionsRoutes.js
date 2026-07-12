const express = require("express");
const ctrl = require("../controllers/permissionsController");

const router = express.Router();
router.get("/", ctrl.matrix);

module.exports = router;
