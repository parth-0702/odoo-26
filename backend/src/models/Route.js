const mongoose = require("mongoose");

const ROUTE_STATUSES = ["planned", "in_progress", "completed", "delayed"];

const routeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true, uppercase: true, unique: true },
    origin: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    distanceKm: { type: Number, min: 0, required: true },
    status: { type: String, enum: ROUTE_STATUSES, default: "planned" },
    scheduledDate: { type: Date, required: true },
    assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", default: null },
    assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", default: null },
  },
  { timestamps: true }
);

routeSchema.statics.STATUSES = ROUTE_STATUSES;

module.exports = mongoose.model("Route", routeSchema);
