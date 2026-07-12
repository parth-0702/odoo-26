const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    cargo: { type: String, default: "" },
    distanceKm: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["queued", "dispatched", "in_transit", "delayed", "completed", "cancelled"],
      default: "queued",
      index: true,
    },
    priority: { type: String, enum: ["low", "normal", "high", "urgent"], default: "normal" },
    scheduledStart: { type: Date },
    scheduledEnd: { type: Date },
    actualStart: { type: Date },
    actualEnd: { type: Date },
    etaMinutes: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);