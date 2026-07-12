const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: { type: String, required: true, unique: true, trim: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    type: {
      type: String,
      enum: ["truck", "van", "bus", "tanker", "trailer", "car"],
      default: "truck",
    },
    status: {
      type: String,
      enum: ["active", "idle", "in_maintenance", "flagged", "retired"],
      default: "idle",
      index: true,
    },
    odometer: { type: Number, default: 0 },
    fuelType: { type: String, enum: ["diesel", "petrol", "electric", "cng"], default: "diesel" },
    fuelLevel: { type: Number, default: 100 }, // percentage
    location: {
      label: { type: String, default: "" },
      lat: { type: Number },
      lng: { type: Number },
    },
    assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    healthScore: { type: Number, default: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);