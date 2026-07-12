import type { DriverStatus, MaintenanceStatus, TripStatus, VehicleStatus } from "@/types";

type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

export const vehicleStatusTone: Record<VehicleStatus, Tone> = {
  active: "success",
  idle: "neutral",
  in_maintenance: "warning",
  flagged: "danger",
  retired: "info",
};

export const driverStatusTone: Record<DriverStatus, Tone> = {
  on_duty: "success",
  resting: "warning",
  off_duty: "neutral",
  at_risk: "danger",
};

export const tripStatusTone: Record<TripStatus, Tone> = {
  queued: "neutral",
  dispatched: "info",
  in_transit: "success",
  delayed: "danger",
  completed: "primary",
  cancelled: "info",
};

export const maintenanceStatusTone: Record<MaintenanceStatus, Tone> = {
  due: "warning",
  scheduled: "info",
  in_progress: "primary",
  completed: "success",
  overdue: "danger",
};

export const docStatusTone: Record<string, Tone> = {
  valid: "success",
  expiring_soon: "warning",
  expired: "danger",
  missing: "neutral",
};

export const DOC_TYPE_LABELS: Record<string, string> = {
  rc_book: "RC Book",
  insurance: "Insurance",
  puc: "PUC Certificate",
  permit: "Permit",
  fitness_certificate: "Fitness Certificate",
};