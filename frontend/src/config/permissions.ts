import type { Role } from "@/types";

/**
 * Centralized RBAC configuration (frontend source of truth).
 * Mirrors backend/src/config/permissions.js — keep both in sync.
 */

export const ROLES: Record<string, Role> = {
  FLEET_MANAGER: "fleet_manager",
  DISPATCHER: "dispatcher",
  SAFETY_OFFICER: "safety_officer",
  FINANCIAL_ANALYST: "financial_analyst",
};

export const ROLE_LABELS: Record<Role, string> = {
  fleet_manager: "Fleet Manager",
  dispatcher: "Dispatcher",
  safety_officer: "Safety Officer",
  financial_analyst: "Financial Analyst",
};

export type Resource =
  | "vehicle"
  | "driver"
  | "trip"
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

type Matrix = Record<Role, Partial<Record<Resource, Action[]>>>;

export const PERMISSION_MATRIX: Matrix = {
  fleet_manager: {
    vehicle: ALL, driver: ALL, trip: ALL, maintenance: ALL,
    fuel: ALL, expense: ALL, document: ALL, notification: ALL,
    report: ALL, user: ALL,
  },
  dispatcher: {
    vehicle: RO, driver: RO, trip: ALL, maintenance: RO,
    fuel: RO, document: RO, notification: ["read", "update"],
  },
  safety_officer: {
    vehicle: RO, driver: ALL, trip: RO, maintenance: ALL,
    document: ALL, notification: ["read", "update"], report: RO,
  },
  financial_analyst: {
    vehicle: RO, trip: RO, fuel: ALL, expense: ALL,
    report: ALL, notification: ["read", "update"], document: RO,
  },
};

export function can(role: Role | undefined, resource: Resource, action: Action): boolean {
  if (!role) return false;
  const allowed = PERMISSION_MATRIX[role]?.[resource];
  return !!allowed && allowed.includes(action);
}