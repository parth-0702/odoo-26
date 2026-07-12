const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    type: {
      type: String,
      enum: ["scheduled", "repair", "inspection", "predictive", "recall"],
      default: "scheduled",
    },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["due", "scheduled", "in_progress", "completed", "overdue"],
      default: "due",
      index: true,
    },
    severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    cost: { type: Number, default: 0 },
    dueDate: { type: Date },
    completedDate: { type: Date },
    serviceProvider: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);