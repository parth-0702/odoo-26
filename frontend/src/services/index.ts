import { createResourceService } from "./createResourceService";
import { ENDPOINTS } from "@/api/endpoints";
import {
  mockVehicles, mockDrivers, mockTrips, mockMaintenance,
  mockFuelLogs, mockExpenses, mockDocuments,
} from "@/mocks";
import type {
  Vehicle, Driver, Trip, Maintenance, FuelLog, Expense, VehicleDocument,
} from "@/types";

export const vehicleService = createResourceService<Vehicle>(ENDPOINTS.vehicles, mockVehicles);
export const driverService = createResourceService<Driver>(ENDPOINTS.drivers, mockDrivers);
export const tripService = createResourceService<Trip>(ENDPOINTS.trips, mockTrips);
export const maintenanceService = createResourceService<Maintenance>(ENDPOINTS.maintenance, mockMaintenance);
export const fuelService = createResourceService<FuelLog>(ENDPOINTS.fuelLogs, mockFuelLogs);
export const expenseService = createResourceService<Expense>(ENDPOINTS.expenses, mockExpenses);
export const documentService = createResourceService<VehicleDocument>(ENDPOINTS.documents, mockDocuments);

export { authService } from "./authService";
export { notificationService } from "./notificationService";
export { searchService } from "./searchService";