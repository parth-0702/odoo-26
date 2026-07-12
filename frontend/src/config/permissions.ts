import type { Role } from "@/types";

/**
 * Centralized RBAC configuration (frontend source of truth).
 * Mirrors backend/src/config/permissions.js — keep both in sync.
 */

export const ROLES: Record<string, Role> = {
  ADMIN: "admin",
  FLEET_MANAGER: "fleet_manager",
  DRIVER: "driver",
  STAFF: "staff",
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  fleet_manager: "Fleet Manager",
  driver: "Driver",
  staff: "Staff",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: "Full access to every module — manage users, fleet & operations.",
  fleet_manager: "Full CRUD on vehicles, drivers, routes/trips & shipments.",
  driver: "View fleet data, update status on your own trips & shipments.",
  staff: "Read-only visibility across drivers, vehicles, trips & shipments.",
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
  | "user";

export type Action = "read" | "create" | "update" | "delete";

const ALL: Action[] = ["read", "create", "update", "delete"];
const RO: Action[] = ["read"];
const RU: Action[] = ["read", "update"];

type Matrix = Record<Role, Partial<Record<Resource, Action[]>>>;

/**
 * Permission matrix: role -> resource -> allowed actions.
 * Mirrors backend/src/config/permissions.js — keep both in sync.
 */
export const PERMISSION_MATRIX: Matrix = {
  admin: {
    vehicle: ALL, driver: ALL, trip: ALL, shipment: ALL, maintenance: ALL,
    fuel: ALL, expense: ALL, document: ALL, notification: ALL,
    report: ALL, user: ALL,
  },
  fleet_manager: {
    vehicle: ALL, driver: ALL, trip: ALL, shipment: ALL, maintenance: ALL,
    document: ALL, fuel: RO, expense: RO, report: RO,
    notification: RU,
  },
  driver: {
    vehicle: RO, driver: RO, trip: RU, shipment: RU,
    document: RO, notification: RU,
  },
  staff: {
    vehicle: RO, driver: RO, trip: RO, shipment: RO,
    maintenance: RO, document: RO, notification: RU,
  },
};

export function can(role: Role | undefined, resource: Resource, action: Action): boolean {
  if (!role) return false;
  const allowed = PERMISSION_MATRIX[role]?.[resource];
  return !!allowed && allowed.includes(action);
}