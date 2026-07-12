import { createResourceService } from "./createResourceService";
import { ENDPOINTS } from "@/api/endpoints";
import {
  mockVehicles, mockDrivers, mockTrips, mockShipments, mockMaintenance,
  mockFuelLogs, mockExpenses, mockDocuments,
} from "@/mocks";
import type {
  Vehicle, Driver, Trip, Shipment, Maintenance, FuelLog, Expense, VehicleDocument,
} from "@/types";

export const vehicleService = createResourceService<Vehicle>(ENDPOINTS.vehicles, mockVehicles);
export const driverService = createResourceService<Driver>(ENDPOINTS.drivers, mockDrivers);
export const tripService = createResourceService<Trip>(ENDPOINTS.trips, mockTrips);
export const shipmentService = createResourceService<Shipment>(ENDPOINTS.shipments, mockShipments);
export const maintenanceService = createResourceService<Maintenance>(ENDPOINTS.maintenance, mockMaintenance);
export const fuelService = createResourceService<FuelLog>(ENDPOINTS.fuelLogs, mockFuelLogs);
export const expenseService = createResourceService<Expense>(ENDPOINTS.expenses, mockExpenses);
export const documentService = createResourceService<VehicleDocument>(ENDPOINTS.documents, mockDocuments);

export { authService } from "./authService";
export { notificationService } from "./notificationService";
export { searchService } from "./searchService";