const asyncHandler = require("express-async-handler");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");
const VehicleDocument = require("../models/VehicleDocument");

// GET /api/search?q=...  — global search across vehicles, drivers, trips, documents
const globalSearch = asyncHandler(async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ data: { vehicles: [], drivers: [], trips: [], documents: [] } });
  const rx = { $regex: q, $options: "i" };

  const [vehicles, drivers, trips, documents] = await Promise.all([
    Vehicle.find({ $or: [{ registrationNumber: rx }, { make: rx }, { model: rx }] }).limit(6),
    Driver.find({ $or: [{ name: rx }, { employeeId: rx }, { licenseNumber: rx }] }).limit(6),
    Trip.find({ $or: [{ reference: rx }, { origin: rx }, { destination: rx }] }).limit(6),
    VehicleDocument.find({ $or: [{ documentNumber: rx }, { fileName: rx }] }).limit(6),
  ]);

  res.json({ data: { vehicles, drivers, trips, documents } });
});

module.exports = { globalSearch };