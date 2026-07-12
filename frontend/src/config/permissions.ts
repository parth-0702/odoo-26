import type { Role } from "@/types";

/**
 * Centralized RBAC configuration (frontend source of truth).
 * Mirrors backend/src/config/permissions.js — keep both in sync.
 */

export const ROLES: Record<string, Role> = {
  ADMIN: "admin",
  FLEET_MANAGER: "fleet_manager",
  DRIVER: "driver",
  SAFETY_OFFICER: "safety_officer",
  FINANCIAL_ANALYST: "financial_analyst",
  STAFF: "staff",
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  fleet_manager: "Fleet Manager",
  driver: "Driver",
  safety_officer: "Safety Officer",
  financial_analyst: "Financial Analyst",
  staff: "Staff",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: "Full access to every module — manage users, fleet & operations.",
  fleet_manager: "Manage vehicles, drivers, routes/trips, shipments, and expenses.",
  driver: "Track assigned trips & shipments, file fuel logs & trip expenses.",
  safety_officer: "Monitor safety compliance, driver status, and maintenance.",
  financial_analyst: "Track fuel efficiency, fleet expenses, and financial reports.",
  staff: "Read-only visibility across drivers, vehicles, trips & shipments.",
};

export const ROLE_COLORS: Record<Role, string> = {
  admin: "#EF4444",
  fleet_manager: "#FF6B00",
  driver: "#3B82F6",
  safety_officer: "#22C55E",
  financial_analyst: "#A855F7",
  staff: "#64748B",
};

export type Resource =
  | "vehicle"
  | "driver"
  | "trip"
  | "shipment"
  | "maintenance"
  | "fuel"
  | "expense"
  | "document"
  | "notification"
  | "report"
  | "user"
  | "gps"
  | "analytics";

export type Action = "read" | "create" | "update" | "delete";

const ALL: Action[] = ["read", "create", "update", "delete"];
const RO: Action[] = ["read"];
const RU: Action[] = ["read", "update"];

type Matrix = Record<Role, Partial<Record<Resource, Action[]>>>;

/**
 * Permission matrix: role -> resource -> allowed actions.
 * Mirrors backend/src/config/permissions.js.
 */
export const PERMISSION_MATRIX: Matrix = {
  admin: {
    vehicle: ALL, driver: ALL, trip: ALL, shipment: ALL, maintenance: ALL,
    fuel: ALL, expense: ALL, document: ALL, notification: ALL,
    report: ALL, user: ALL, gps: ALL, analytics: ALL,
  },
  fleet_manager: {
    vehicle: ALL, driver: ALL, trip: ALL, shipment: ALL, maintenance: ALL,
    document: ALL, fuel: RO, expense: ALL, report: RO,
    notification: RU, gps: ALL, analytics: RO,
  },
  driver: {
    vehicle: RO, driver: RO, trip: RU, shipment: RU,
    document: RO, notification: RU, expense: ["read", "create"],
    fuel: ["read", "create"], gps: RO,
  },
  safety_officer: {
    vehicle: RU, driver: ALL, trip: RO, shipment: RO,
    maintenance: ALL, document: RO, notification: RU,
    gps: RO, analytics: RO,
  },
  financial_analyst: {
    vehicle: RO, driver: RO, trip: RO, shipment: RO,
    fuel: ALL, expense: ALL, report: RO, analytics: ALL,
  },
  staff: {
    vehicle: RO, driver: RO, trip: RO, shipment: RO,
    maintenance: RO, document: RO, notification: RU,
    gps: RO,
  },
};

export function can(role: Role | undefined, resource: Resource, action: Action): boolean {
  if (!role) return false;
  const allowed = PERMISSION_MATRIX[role]?.[resource];
  return !!allowed && allowed.includes(action);
}