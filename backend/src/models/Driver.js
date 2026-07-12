const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    employeeId: { type: String, required: true, unique: true },
    phone: { type: String },
    email: { type: String, lowercase: true },
    avatarUrl: { type: String, default: "" },
    licenseNumber: { type: String, required: true },
    licenseExpiry: { type: Date, required: true },
    status: {
      type: String,
      enum: ["on_duty", "resting", "off_duty", "at_risk"],
      default: "off_duty",
      index: true,
    },
    safetyScore: { type: Number, default: 100 }, // 0-100
    hoursThisWeek: { type: Number, default: 0 },
    assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    complianceFlags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);