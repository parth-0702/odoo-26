import { useAsync } from "./useAsync";
import {
  vehicleService, driverService, tripService, shipmentService, maintenanceService,
  fuelService, expenseService, documentService,
} from "@/services";

export const useVehicles = () => useAsync(() => vehicleService.list(), []);
export const useVehicle = (id: string) => useAsync(() => vehicleService.get(id), [id]);
export const useDrivers = () => useAsync(() => driverService.list(), []);
export const useTrips = () => useAsync(() => tripService.list(), []);
export const useShipments = () => useAsync(() => shipmentService.list(), []);
export const useMaintenance = () => useAsync(() => maintenanceService.list(), []);
export const useFuelLogs = () => useAsync(() => fuelService.list(), []);
export const useExpenses = () => useAsync(() => expenseService.list(), []);
export const useDocuments = () => useAsync(() => documentService.list(), []);