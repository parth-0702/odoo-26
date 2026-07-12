/**
 * Isolated mock dataset. This is the ONLY place hardcoded demo data lives.
 * Services read from here when no API base URL is configured (VITE_API_BASE_URL).
 * Replace by pointing services at the real API — no component changes needed.
 */
import type {
  Vehicle, Driver, Trip, Shipment, Maintenance, FuelLog, Expense, AppNotification, VehicleDocument, User,
  VehicleAssessment,
} from "@/types";

const now = Date.now();
const days = (d: number) => new Date(now + d * 864e5).toISOString();

export const mockUsers: User[] = [
  { _id: "u1", name: "Vikram Singh", email: "admin@arjuna.com", role: "admin" },
  { _id: "u2", name: "Aarav Mehta", email: "manager@arjuna.com", role: "fleet_manager" },
  { _id: "u3", name: "J. Doe", email: "driver@arjuna.com", role: "driver" },
  { _id: "u4", name: "Ananya Iyer", email: "staff@arjuna.com", role: "staff" },
];

export const mockDrivers: Driver[] = [
  { _id: "d1", name: "J. Doe", employeeId: "DRV-001", licenseNumber: "MH12-2020-11", licenseExpiry: days(20), status: "on_duty", safetyScore: 92, hoursThisWeek: 38, yearsExperience: 5, currentRoute: "Mumbai → Pune", hoursAvailable: 6.7 },
  { _id: "d2", name: "A. Smith", employeeId: "DRV-002", licenseNumber: "MH12-2019-42", licenseExpiry: days(-5), status: "at_risk", safetyScore: 61, hoursThisWeek: 52, complianceFlags: ["license_expired", "over_hours"], yearsExperience: 8, currentRoute: "Delhi → Jaipur", hoursAvailable: 1.3, recentViolation: "Hard braking event" },
  { _id: "d3", name: "M. Johnson", employeeId: "DRV-003", licenseNumber: "MH12-2021-77", licenseExpiry: days(120), status: "resting", safetyScore: 88, hoursThisWeek: 26, yearsExperience: 3, currentRoute: "N/A · Off shift", hoursAvailable: 11.0 },
  { _id: "d4", name: "R. Patel", employeeId: "DRV-004", licenseNumber: "MH12-2022-08", licenseExpiry: days(300), status: "off_duty", safetyScore: 95, hoursThisWeek: 12, yearsExperience: 6, currentRoute: "N/A · Off duty", hoursAvailable: 14.0 },
  { _id: "d5", name: "S. Jenkins", employeeId: "DRV-8190", licenseNumber: "GJ06-2023-14", licenseExpiry: days(30), status: "resting", safetyScore: 74, hoursThisWeek: 41, yearsExperience: 2, currentRoute: "N/A · Off shift", hoursAvailable: 11.0 },
  { _id: "d6", name: "Robert Chen", employeeId: "DRV-3312", licenseNumber: "GJ06-2021-59", licenseExpiry: days(500), status: "at_risk", safetyScore: 52, hoursThisWeek: 58, yearsExperience: 8, currentRoute: "LAX → PHX", hoursAvailable: 1.25, complianceFlags: ["over_hours"], recentViolation: "Hard braking — repeat" },
  { _id: "d7", name: "N. Verma", employeeId: "DRV-1187", licenseNumber: "GJ06-2020-31", licenseExpiry: days(400), status: "on_duty", safetyScore: 97, hoursThisWeek: 33, yearsExperience: 9, currentRoute: "Ahmedabad → Baroda", hoursAvailable: 7.5 },
  { _id: "d8", name: "K. Desai", employeeId: "DRV-2244", licenseNumber: "GJ06-2019-05", licenseExpiry: days(60), status: "on_duty", safetyScore: 84, hoursThisWeek: 44, yearsExperience: 4, currentRoute: "Surat → Nashik", hoursAvailable: 4.2 },
  { _id: "d9", name: "P. Iyer", employeeId: "DRV-5561", licenseNumber: "GJ06-2022-88", licenseExpiry: days(200), status: "off_duty", safetyScore: 90, hoursThisWeek: 18, yearsExperience: 5, currentRoute: "N/A · Off duty", hoursAvailable: 13.5 },
];

export const mockVehicles: Vehicle[] = [
  { _id: "v1", registrationNumber: "V-8942", make: "Tata", model: "Prima", year: 2022, type: "truck", status: "active", odometer: 84500, fuelType: "diesel", fuelLevel: 72, healthScore: 94, assignedDriver: mockDrivers[0], location: { label: "Sector 7G, Industrial Park", x: 47, y: 42, lat: 19.0760, lng: 72.8777 }, speedKmph: 62 },
  { _id: "v2", registrationNumber: "V-4092", make: "Ashok Leyland", model: "Boss", year: 2021, type: "truck", status: "flagged", odometer: 132000, fuelType: "diesel", fuelLevel: 20, healthScore: 58, assignedDriver: mockDrivers[1], location: { label: "Highway 405, Mile 12", x: 38, y: 22, lat: 18.5204, lng: 73.8567 }, speedKmph: 0 },
  { _id: "v3", registrationNumber: "V-1105", make: "Eicher", model: "Pro 2049", year: 2023, type: "van", status: "in_maintenance", odometer: 41000, fuelType: "diesel", fuelLevel: 90, healthScore: 76, assignedDriver: mockDrivers[2], location: { label: "Central Hub Dock 4", x: 55, y: 55, lat: 21.1458, lng: 79.0882 }, speedKmph: 0 },
  { _id: "v4", registrationNumber: "V-2280", make: "BharatBenz", model: "1617R", year: 2020, type: "truck", status: "idle", odometer: 98000, fuelType: "diesel", fuelLevel: 55, healthScore: 82, assignedDriver: mockDrivers[3], location: { label: "Depot A", x: 33, y: 60, lat: 21.1702, lng: 72.8311 }, speedKmph: 0 },
  { _id: "v5", registrationNumber: "V-3391", make: "Tata", model: "Signa", year: 2022, type: "truck", status: "active", odometer: 65200, fuelType: "diesel", fuelLevel: 64, healthScore: 88, assignedDriver: mockDrivers[6], location: { label: "Baroda Bypass", x: 41, y: 47, lat: 22.3072, lng: 73.1812 }, speedKmph: 71 },
  { _id: "v6", registrationNumber: "V-7710", make: "Mahindra", model: "Blazo", year: 2021, type: "truck", status: "active", odometer: 71800, fuelType: "diesel", fuelLevel: 48, healthScore: 90, assignedDriver: mockDrivers[7], location: { label: "NH48, Nashik Stretch", x: 36, y: 65, lat: 20.0110, lng: 73.7903 }, speedKmph: 58 },
  { _id: "v7", registrationNumber: "V-5528", make: "Volvo", model: "FMX", year: 2023, type: "truck", status: "idle", odometer: 22300, fuelType: "diesel", fuelLevel: 81, healthScore: 96, location: { label: "Chennai Yard", x: 58, y: 78, lat: 13.0827, lng: 80.2707 }, speedKmph: 0 },
  { _id: "v8", registrationNumber: "V-9034", make: "Eicher", model: "Skyline", year: 2020, type: "bus", status: "active", odometer: 154000, fuelType: "diesel", fuelLevel: 39, healthScore: 71, location: { label: "Kolkata Ring Road", x: 74, y: 43, lat: 22.5726, lng: 88.3639 }, speedKmph: 44 },
  { _id: "v9", registrationNumber: "V-6647", make: "Tata", model: "Ace", year: 2023, type: "van", status: "active", odometer: 18900, fuelType: "electric", fuelLevel: 92, healthScore: 98, location: { label: "Bengaluru Hub", x: 52, y: 74, lat: 12.9716, lng: 77.5946 }, speedKmph: 35 },
  { _id: "v10", registrationNumber: "V-2201", make: "Ashok Leyland", model: "Dost", year: 2019, type: "van", status: "flagged", odometer: 141200, fuelType: "diesel", fuelLevel: 12, healthScore: 44, location: { label: "Lucknow Depot", x: 57, y: 32, lat: 26.8467, lng: 80.9462 }, speedKmph: 0 },
  { _id: "v11", registrationNumber: "V-8813", make: "BharatBenz", model: "914R", year: 2022, type: "truck", status: "active", odometer: 53400, fuelType: "diesel", fuelLevel: 58, healthScore: 85, location: { label: "Kanpur Ring Road", x: 55, y: 38, lat: 26.4499, lng: 80.3319 }, speedKmph: 66 },
  { _id: "v12", registrationNumber: "V-4470", make: "Tata", model: "Winger", year: 2021, type: "van", status: "idle", odometer: 39800, fuelType: "diesel", fuelLevel: 70, healthScore: 79, location: { label: "Hyderabad Depot", x: 55, y: 62, lat: 17.3850, lng: 78.4867 }, speedKmph: 0 },
  { _id: "v13", registrationNumber: "V-1987", make: "Eicher", model: "Pro 3015", year: 2020, type: "truck", status: "in_maintenance", odometer: 112000, fuelType: "diesel", fuelLevel: 33, healthScore: 62, location: { label: "Indore Service Center", x: 46, y: 52, lat: 22.7196, lng: 75.8577 }, speedKmph: 0 },
  { _id: "v14", registrationNumber: "V-6602", make: "Ashok Leyland", model: "Partner", year: 2023, type: "truck", status: "active", odometer: 9100, fuelType: "cng", fuelLevel: 66, healthScore: 99, location: { label: "Jaipur Bypass", x: 45, y: 30, lat: 26.9124, lng: 75.7873 }, speedKmph: 54 },
];

export const mockTrips: Trip[] = [
  { _id: "t1", reference: "TRP-1001", vehicle: mockVehicles[0], driver: mockDrivers[0], origin: "Mumbai", destination: "Pune", cargo: "Electronics", distanceKm: 150, status: "in_transit", priority: "high", etaMinutes: 45 },
  { _id: "t2", reference: "TRP-1002", vehicle: mockVehicles[1], driver: mockDrivers[1], origin: "Delhi", destination: "Jaipur", cargo: "Textiles", distanceKm: 280, status: "delayed", priority: "urgent" },
  { _id: "t3", reference: "TRP-1003", vehicle: mockVehicles[2], driver: mockDrivers[2], origin: "Nagpur", destination: "Indore", cargo: "FMCG", distanceKm: 380, status: "queued", priority: "normal" },
  { _id: "t4", reference: "TRP-1004", vehicle: mockVehicles[3], driver: mockDrivers[3], origin: "Surat", destination: "Ahmedabad", cargo: "Chemicals", distanceKm: 265, status: "completed", priority: "low" },
];

export const mockShipments: Shipment[] = [
  { _id: "s1", reference: "SHP-5001", trip: mockTrips[0], vehicle: mockVehicles[0], driver: mockDrivers[0], customerName: "Reliance Retail", origin: "Mumbai", destination: "Pune", contents: "Electronics", weightKg: 1200, status: "in_transit", priority: "high", expectedDelivery: days(1) },
  { _id: "s2", reference: "SHP-5002", trip: mockTrips[1], vehicle: mockVehicles[1], driver: mockDrivers[1], customerName: "Future Group", origin: "Delhi", destination: "Jaipur", contents: "Textiles", weightKg: 800, status: "pending", priority: "urgent", expectedDelivery: days(2) },
  { _id: "s3", reference: "SHP-5003", trip: mockTrips[2], vehicle: mockVehicles[2], driver: mockDrivers[2], customerName: "Amazon India", origin: "Nagpur", destination: "Indore", contents: "FMCG", weightKg: 650, status: "picked_up", priority: "normal", expectedDelivery: days(3) },
  { _id: "s4", reference: "SHP-5004", trip: mockTrips[3], vehicle: mockVehicles[3], driver: mockDrivers[3], customerName: "Flipkart", origin: "Surat", destination: "Ahmedabad", contents: "Apparel", weightKg: 400, status: "delivered", priority: "low", deliveredAt: days(-1) },
];

export const mockMaintenance: Maintenance[] = [
  { _id: "m1", vehicle: mockVehicles[2], type: "scheduled", title: "50k km service", status: "in_progress", severity: "medium", cost: 18500, dueDate: days(0) },
  { _id: "m2", vehicle: mockVehicles[1], type: "predictive", title: "Engine temperature anomaly", description: "Irregular engine temperature detected — schedule inspection within 48hrs.", status: "overdue", severity: "critical", cost: 0, dueDate: days(-2) },
  { _id: "m3", vehicle: mockVehicles[0], type: "inspection", title: "Quarterly safety inspection", status: "scheduled", severity: "low", cost: 3200, dueDate: days(12) },
];

export const mockFuelLogs: FuelLog[] = [
  { _id: "f1", vehicle: mockVehicles[0], driver: mockDrivers[0], date: days(-1), liters: 120, pricePerLiter: 96.5, totalCost: 11580, odometer: 84500, efficiencyKmpl: 4.2, station: "IOC Highway" },
  { _id: "f2", vehicle: mockVehicles[3], driver: mockDrivers[3], date: days(-3), liters: 90, pricePerLiter: 95.8, totalCost: 8622, odometer: 98000, efficiencyKmpl: 5.1, station: "HP Depot" },
];

export const mockExpenses: Expense[] = [
  { _id: "e1", category: "tolls", description: "FASTag — Mumbai-Pune expressway", amount: 850, currency: "INR", date: days(-1), vehicle: mockVehicles[0], status: "approved", recordedBy: mockUsers[2] },
  { _id: "e2", category: "maintenance", description: "50k service parts", amount: 18500, currency: "INR", date: days(0), vehicle: mockVehicles[2], status: "pending", recordedBy: mockUsers[1] },
  { _id: "e3", category: "insurance", description: "Fleet policy renewal", amount: 145000, currency: "INR", date: days(-10), status: "approved", recordedBy: mockUsers[0] },
  { _id: "e4", category: "fuel", description: "Emergency Diesel Refill NH8", amount: 4800, currency: "INR", date: days(-2), vehicle: mockVehicles[0], status: "pending", recordedBy: mockUsers[2] },
  { _id: "e5", category: "permits", description: "State border permit fee", amount: 2500, currency: "INR", date: days(-4), vehicle: mockVehicles[4], status: "approved", recordedBy: mockUsers[2] },
  { _id: "e6", category: "other", description: "Loading bay assistant tips", amount: 350, currency: "INR", date: days(-1), vehicle: mockVehicles[1], status: "rejected", recordedBy: mockUsers[2] },
  { _id: "e7", category: "maintenance", description: "New tyre replacement for prime mover", amount: 12000, currency: "INR", date: days(-5), vehicle: mockVehicles[0], status: "approved", recordedBy: mockUsers[1] },
  { _id: "e8", category: "tolls", description: "Delhi border toll taxes", amount: 1200, currency: "INR", date: days(-3), vehicle: mockVehicles[4], status: "pending", recordedBy: mockUsers[2] },
];

export const mockDocuments: VehicleDocument[] = [
  { _id: "doc1", vehicle: mockVehicles[0], docType: "insurance", documentNumber: "INS-8942", expiryDate: days(15), status: "expiring_soon" },
  { _id: "doc2", vehicle: mockVehicles[1], docType: "puc", documentNumber: "PUC-4092", expiryDate: days(-3), status: "expired" },
  { _id: "doc3", vehicle: mockVehicles[0], docType: "rc_book", documentNumber: "RC-8942", expiryDate: days(900), status: "valid" },
  { _id: "doc4", vehicle: mockVehicles[2], docType: "fitness_certificate", documentNumber: "FIT-1105", expiryDate: days(45), status: "valid" },
  { _id: "doc5", vehicle: mockVehicles[3], docType: "permit", documentNumber: "PRM-2280", expiryDate: days(200), status: "valid" },
];

export const mockNotifications: AppNotification[] = [
  { _id: "n1", type: "license_expiry", title: "License expired", message: "A. Smith's driving license has expired.", severity: "critical", read: false, audienceRoles: ["admin", "fleet_manager"], createdAt: days(0) },
  { _id: "n2", type: "maintenance_reminder", title: "Service overdue", message: "Vehicle V-4092 engine inspection is overdue.", severity: "critical", read: false, createdAt: days(0) },
  { _id: "n3", type: "trip_delayed", title: "Trip delayed", message: "TRP-1002 (Delhi → Jaipur) is running behind schedule.", severity: "warning", read: false, audienceRoles: ["driver", "fleet_manager"], createdAt: days(-1) },
  { _id: "n4", type: "document_expiry", title: "Document expiring", message: "Insurance for V-8942 expires in 15 days.", severity: "warning", read: true, createdAt: days(-2) },
];

/** AI-generated post-inspection assessments shown on the command center dashboard. */
export const mockAssessments: VehicleAssessment[] = [
  { _id: "as1", roNumber: "RO #195724", vehicle: mockVehicles[0], title: "Transmission Replacement", verdict: "requires_review", summary: "Labor hours exceed benchmark by 22% — confirm parts warranty before approval.", createdAt: days(0) },
  { _id: "as2", roNumber: "RO #195725", vehicle: mockVehicles[1], title: "Cooling System Flush", verdict: "unacceptable", summary: "Line items don't match diagnosis. Flag vendor for review.", createdAt: days(0) },
  { _id: "as3", roNumber: "RO #195726", vehicle: mockVehicles[3], title: "Alignment Service", verdict: "acceptable", summary: "Cost and labor within expected range for this repair type.", createdAt: days(-1) },
  { _id: "as4", roNumber: "RO #195730", vehicle: mockVehicles[9], title: "Brake Pad Replacement", verdict: "acceptable", summary: "Matches standard parts + labor estimate.", createdAt: days(-1) },
];

/** Rolling monthly trend data used by the dashboard's lightweight charts. */
export const mockFuelCostTrend = [
  { label: "Aug", value: 14200 },
  { label: "Sep", value: 9800 },
  { label: "Oct", value: 12600 },
  { label: "Nov", value: 17400 },
  { label: "Dec", value: 13048 },
  { label: "Jan", value: 15900 },
];

export const mockWorkOrderTrend = [
  { label: "Aug", value: 6 },
  { label: "Sep", value: 9 },
  { label: "Oct", value: 7 },
  { label: "Nov", value: 11 },
  { label: "Dec", value: 8 },
  { label: "Jan", value: 4 },
];
