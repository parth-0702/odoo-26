const express = require("express");

const buildResourceRouter = require("./resourceRoutes");
const authRoutes = require("./authRoutes");

const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");
const Maintenance = require("../models/Maintenance");
const FuelLog = require("../models/FuelLog");
const Expense = require("../models/Expense");
const VehicleDocument = require("../models/VehicleDocument");

const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");
const { globalSearch } = require("../controllers/searchController");
const {
  listForUser,
  markRead,
  markAllRead,
} = require("../controllers/notificationController");

const router = express.Router();

router.use("/auth", authRoutes);

// Standard RBAC-protected CRUD resources
router.use("/vehicles", buildResourceRouter(Vehicle, "vehicle", {
  populate: ["assignedDriver"],
  searchFields: ["registrationNumber", "make", "model"],
}));
router.use("/drivers", buildResourceRouter(Driver, "driver", {
  populate: ["assignedVehicle"],
  searchFields: ["name", "employeeId", "licenseNumber"],
}));
router.use("/trips", buildResourceRouter(Trip, "trip", {
  populate: ["vehicle", "driver"],
  searchFields: ["reference", "origin", "destination"],
}));
router.use("/maintenance", buildResourceRouter(Maintenance, "maintenance", {
  populate: ["vehicle"],
  searchFields: ["title", "description"],
}));
router.use("/fuel-logs", buildResourceRouter(FuelLog, "fuel", {
  populate: ["vehicle", "driver"],
}));
router.use("/expenses", buildResourceRouter(Expense, "expense", {
  populate: ["vehicle", "trip"],
  searchFields: ["description"],
}));
router.use("/documents", buildResourceRouter(VehicleDocument, "document", {
  populate: ["vehicle"],
  searchFields: ["documentNumber", "fileName"],
}));

// Notifications (custom controller, role-scoped)
router.get("/notifications", protect, authorize("notification", "read"), listForUser);
router.put("/notifications/read-all", protect, authorize("notification", "update"), markAllRead);
router.put("/notifications/:id/read", protect, authorize("notification", "update"), markRead);

// Global search
router.get("/search", protect, globalSearch);

module.exports = router;