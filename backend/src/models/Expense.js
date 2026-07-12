const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["fuel", "maintenance", "tolls", "insurance", "salary", "permits", "other"],
      default: "other",
      index: true,
    },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    date: { type: Date, default: Date.now },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);