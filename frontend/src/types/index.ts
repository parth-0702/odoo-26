export type Role =
  | "admin"
  | "fleet_manager"
  | "driver"
  | "safety_officer"
  | "financial_analyst"
  | "staff";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  phone?: string;
  isActive?: boolean;
  lastLoginAt?: string;
}

export type VehicleStatus = "active" | "idle" | "in_maintenance" | "flagged" | "retired";

export interface Vehicle {
  _id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year?: number;
  type: "truck" | "van" | "bus" | "tanker" | "trailer" | "car";
  status: VehicleStatus;
  odometer: number;
  fuelType: "diesel" | "petrol" | "electric" | "cng";
  fuelLevel: number;
  location?: { label?: string; lat?: number; lng?: number; x?: number; y?: number };
  assignedDriver?: Driver | string | null;
  healthScore: number;
  speedKmph?: number;
}

export type DriverStatus = "on_duty" | "resting" | "off_duty" | "at_risk";

export interface Driver {
  _id: string;
  name: string;
  employeeId: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: DriverStatus;
  safetyScore: number;
  hoursThisWeek: number;
  assignedVehicle?: Vehicle | string | null;
  complianceFlags?: string[];
  yearsExperience?: number;
  currentRoute?: string;
  hoursAvailable?: number;
  recentViolation?: string;
}

export type TripStatus =
  | "queued"
  | "dispatched"
  | "in_transit"
  | "delayed"
  | "completed"
  | "cancelled";

export interface Trip {
  _id: string;
  reference: string;
  vehicle?: Vehicle | string;
  driver?: Driver | string;
  origin: string;
  destination: string;
  cargo?: string;
  distanceKm: number;
  status: TripStatus;
  priority: "low" | "normal" | "high" | "urgent";
  scheduledStart?: string;
  scheduledEnd?: string;
  etaMinutes?: number;
}

export type ShipmentStatus =
  | "pending"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface Shipment {
  _id: string;
  reference: string;
  trip?: Trip | string;
  vehicle?: Vehicle | string;
  driver?: Driver | string;
  customerName: string;
  origin: string;
  destination: string;
  contents?: string;
  weightKg?: number;
  status: ShipmentStatus;
  priority: "low" | "normal" | "high" | "urgent";
  expectedDelivery?: string;
  deliveredAt?: string;
  notes?: string;
}

export type MaintenanceStatus = "due" | "scheduled" | "in_progress" | "completed" | "overdue";

export interface Maintenance {
  _id: string;
  vehicle?: Vehicle | string;
  type: "scheduled" | "repair" | "inspection" | "predictive" | "recall";
  title: string;
  description?: string;
  status: MaintenanceStatus;
  severity: "low" | "medium" | "high" | "critical";
  cost: number;
  dueDate?: string;
  completedDate?: string;
  serviceProvider?: string;
}

export interface FuelLog {
  _id: string;
  vehicle?: Vehicle | string;
  driver?: Driver | string;
  date: string;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  odometer?: number;
  efficiencyKmpl?: number;
  station?: string;
}

export type ExpenseStatus = "pending" | "approved" | "rejected";

export interface Expense {
  _id: string;
  category: "fuel" | "maintenance" | "tolls" | "insurance" | "salary" | "permits" | "other";
  description: string;
  amount: number;
  currency: string;
  date: string;
  vehicle?: Vehicle | string;
  trip?: Trip | string;
  status: ExpenseStatus;
  recordedBy?: User | string;
}

export type NotificationType =
  | "license_expiry"
  | "maintenance_reminder"
  | "trip_delayed"
  | "document_expiry"
  | "system";

export interface AppNotification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  read: boolean;
  audienceRoles?: Role[];
  link?: string;
  createdAt: string;
}

export type DocumentType = "rc_book" | "insurance" | "puc" | "permit" | "fitness_certificate";

export interface VehicleDocument {
  _id: string;
  vehicle?: Vehicle | string;
  docType: DocumentType;
  documentNumber?: string;
  fileUrl?: string;
  fileName?: string;
  issueDate?: string;
  expiryDate?: string;
  status: "valid" | "expiring_soon" | "expired" | "missing";
}

export type AssessmentVerdict = "acceptable" | "requires_review" | "unacceptable";

export interface VehicleAssessment {
  _id: string;
  roNumber: string;
  vehicle?: Vehicle | string;
  title: string;
  verdict: AssessmentVerdict;
  summary?: string;
  createdAt: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchResults {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  documents: VehicleDocument[];
}