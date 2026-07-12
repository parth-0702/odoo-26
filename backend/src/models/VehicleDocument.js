const mongoose = require("mongoose");

const vehicleDocumentSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    docType: {
      type: String,
      enum: ["rc_book", "insurance", "puc", "permit", "fitness_certificate"],
      required: true,
    },
    documentNumber: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    fileName: { type: String, default: "" },
    issueDate: { type: Date },
    expiryDate: { type: Date, index: true },
    status: {
      type: String,
      enum: ["valid", "expiring_soon", "expired", "missing"],
      default: "valid",
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VehicleDocument", vehicleDocumentSchema);