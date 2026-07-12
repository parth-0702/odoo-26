const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "license_expiry",
        "maintenance_reminder",
        "trip_delayed",
        "document_expiry",
        "system",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: { type: String, enum: ["info", "warning", "critical"], default: "info" },
    read: { type: Boolean, default: false, index: true },
    // Optional target audience by role; empty = everyone.
    audienceRoles: [{ type: String }],
    relatedResource: { type: String },
    relatedId: { type: mongoose.Schema.Types.ObjectId },
    link: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);