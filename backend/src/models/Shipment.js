const mongoose = require("mongoose");

const SHIPMENT_STATUSES = ["booked", "in_transit", "delivered", "delayed", "cancelled"];
const PRIORITIES = ["low", "standard", "high", "urgent"];

const shipmentSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, trim: true, uppercase: true, unique: true },
    customerName: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    weightKg: { type: Number, min: 0, required: true },
    priority: { type: String, enum: PRIORITIES, default: "standard" },
    status: { type: String, enum: SHIPMENT_STATUSES, default: "booked" },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", default: null },
  },
  { timestamps: true }
);

shipmentSchema.statics.STATUSES = SHIPMENT_STATUSES;
shipmentSchema.statics.PRIORITIES = PRIORITIES;

module.exports = mongoose.model("Shipment", shipmentSchema);
