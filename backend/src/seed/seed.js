require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");
const Maintenance = require("../models/Maintenance");
const FuelLog = require("../models/FuelLog");
const Expense = require("../models/Expense");
const Notification = require("../models/Notification");
const VehicleDocument = require("../models/VehicleDocument");
const { ROLES } = require("../config/permissions");

const daysFromNow = (d) => new Date(Date.now() + d * 864e5);

async function run() {
  await connectDB();
  console.log("Clearing collections...");
  await Promise.all([
    User.deleteMany({}), Vehicle.deleteMany({}), Driver.deleteMany({}),
    Trip.deleteMany({}), Maintenance.deleteMany({}), FuelLog.deleteMany({}),
    Expense.deleteMany({}), Notification.deleteMany({}), VehicleDocument.deleteMany({}),
  ]);

  console.log("Seeding users...");
  await User.create([
    { name: "Aarav Mehta", email: "manager@arjuna.com", password: "Password123!", role: ROLES.FLEET_MANAGER },
    { name: "Diya Sharma", email: "dispatcher@arjuna.com", password: "Password123!", role: ROLES.DISPATCHER },
    { name: "Kabir Rao", email: "safety@arjuna.com", password: "Password123!", role: ROLES.SAFETY_OFFICER },
    { name: "Ananya Iyer", email: "finance@arjuna.com", password: "Password123!", role: ROLES.FINANCIAL_ANALYST },
  ]);

  console.log("Seeding drivers & vehicles...");
  const drivers = await Driver.create([
    { name: "J. Doe", employeeId: "DRV-001", licenseNumber: "MH12-2020-11", licenseExpiry: daysFromNow(20), status: "on_duty", safetyScore: 92, hoursThisWeek: 38 },
    { name: "A. Smith", employeeId: "DRV-002", licenseNumber: "MH12-2019-42", licenseExpiry: daysFromNow(-5), status: "at_risk", safetyScore: 61, hoursThisWeek: 52 },
    { name: "M. Johnson", employeeId: "DRV-003", licenseNumber: "MH12-2021-77", licenseExpiry: daysFromNow(120), status: "resting", safetyScore: 88, hoursThisWeek: 26 },
  ]);

  const vehicles = await Vehicle.create([
    { registrationNumber: "V-8942", make: "Tata", model: "Prima", year: 2022, type: "truck", status: "active", odometer: 84500, fuelLevel: 72, healthScore: 94, assignedDriver: drivers[0]._id, location: { label: "Sector 7G, Industrial Park" } },
    { registrationNumber: "V-4092", make: "Ashok Leyland", model: "Boss", year: 2021, type: "truck", status: "flagged", odometer: 132000, fuelLevel: 20, healthScore: 58, assignedDriver: drivers[1]._id, location: { label: "Highway 405, Mile 12" } },
    { registrationNumber: "V-1105", make: "Eicher", model: "Pro 2049", year: 2023, type: "van", status: "in_maintenance", odometer: 41000, fuelLevel: 90, healthScore: 76, assignedDriver: drivers[2]._id, location: { label: "Central Hub Dock 4" } },
  ]);

  console.log("Seeding trips, maintenance, fuel, expenses, documents...");
  await Trip.create([
    { reference: "TRP-1001", vehicle: vehicles[0]._id, driver: drivers[0]._id, origin: "Mumbai", destination: "Pune", cargo: "Electronics", distanceKm: 150, status: "in_transit", priority: "high", etaMinutes: 45 },
    { reference: "TRP-1002", vehicle: vehicles[1]._id, driver: drivers[1]._id, origin: "Delhi", destination: "Jaipur", cargo: "Textiles", distanceKm: 280, status: "delayed", priority: "urgent" },
    { reference: "TRP-1003", vehicle: vehicles[2]._id, driver: drivers[2]._id, origin: "Nagpur", destination: "Indore", cargo: "FMCG", distanceKm: 380, status: "queued", priority: "normal" },
  ]);

  await Maintenance.create([
    { vehicle: vehicles[2]._id, type: "scheduled", title: "50k km service", status: "in_progress", severity: "medium", cost: 18500, dueDate: daysFromNow(0) },
    { vehicle: vehicles[1]._id, type: "predictive", title: "Engine temperature anomaly", status: "overdue", severity: "critical", cost: 0, dueDate: daysFromNow(-2) },
  ]);

  await FuelLog.create([
    { vehicle: vehicles[0]._id, driver: drivers[0]._id, liters: 120, pricePerLiter: 96.5, totalCost: 11580, odometer: 84500, efficiencyKmpl: 4.2, station: "IOC Highway" },
  ]);

  await Expense.create([
    { category: "tolls", description: "FASTag — Mumbai-Pune expressway", amount: 850, vehicle: vehicles[0]._id, status: "approved" },
    { category: "maintenance", description: "50k service parts", amount: 18500, vehicle: vehicles[2]._id, status: "pending" },
  ]);

  await VehicleDocument.create([
    { vehicle: vehicles[0]._id, docType: "insurance", documentNumber: "INS-8942", expiryDate: daysFromNow(15), status: "expiring_soon" },
    { vehicle: vehicles[1]._id, docType: "puc", documentNumber: "PUC-4092", expiryDate: daysFromNow(-3), status: "expired" },
    { vehicle: vehicles[0]._id, docType: "rc_book", documentNumber: "RC-8942", expiryDate: daysFromNow(900), status: "valid" },
    { vehicle: vehicles[2]._id, docType: "fitness_certificate", documentNumber: "FIT-1105", expiryDate: daysFromNow(45), status: "valid" },
  ]);

  console.log("Seeding notifications...");
  await Notification.create([
    { type: "license_expiry", title: "License expired", message: "A. Smith's driving license has expired.", severity: "critical", audienceRoles: [ROLES.SAFETY_OFFICER, ROLES.FLEET_MANAGER] },
    { type: "maintenance_reminder", title: "Service overdue", message: "Vehicle V-4092 engine inspection is overdue.", severity: "critical", audienceRoles: [] },
    { type: "trip_delayed", title: "Trip delayed", message: "TRP-1002 (Delhi → Jaipur) is running behind schedule.", severity: "warning", audienceRoles: [ROLES.DISPATCHER, ROLES.FLEET_MANAGER] },
    { type: "document_expiry", title: "Document expiring", message: "Insurance for V-8942 expires in 15 days.", severity: "warning", audienceRoles: [] },
  ]);

  console.log("✔ Seed complete.");
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});