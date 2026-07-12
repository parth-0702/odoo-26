const express = require("express");
const demoAuth = require("../middleware/demoAuth");
const ctrl = require("../controllers/userController");

const router = express.Router();

// Public: powers the role switcher's "who am I acting as" dropdown.
router.get("/", ctrl.list);
// Requires an identity: confirms who you are and what you're allowed to do.
router.get("/me", demoAuth, ctrl.me);

module.exports = router;
