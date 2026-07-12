const mongoose = require("mongoose");

const fuelLogSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    date: { type: Date, default: Date.now },
    liters: { type: Number, required: true },
    pricePerLiter: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    odometer: { type: Number },
    efficiencyKmpl: { type: Number },
    station: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FuelLog", fuelLogSchema);