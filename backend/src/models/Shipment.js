const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    customerName: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    contents: { type: String, default: "" },
    weightKg: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    priority: { type: String, enum: ["low", "normal", "high", "urgent"], default: "normal" },
    expectedDelivery: { type: Date },
    deliveredAt: { type: Date },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipment", shipmentSchema);
