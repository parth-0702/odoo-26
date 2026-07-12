/**
 * Centralized RBAC configuration (single source of truth for the backend).
 * Mirrored on the frontend at frontend/src/config/permissions.ts — keep both
 * in sync when adding roles, resources, or actions.
 */

const ROLES = {
  FLEET_MANAGER: "fleet_manager",
  DISPATCHER: "dispatcher",
  SAFETY_OFFICER: "safety_officer",
  FINANCIAL_ANALYST: "financial_analyst",
};

// Resources map 1:1 to the domain models.
const RESOURCES = [
  "vehicle",
  "driver",
  "trip",
  "maintenance",
  "fuel",
  "expense",
  "document",
  "notification",
  "report",
  "user",
];

const ACTIONS = ["read", "create", "update", "delete"];

const ALL = ACTIONS; // convenience: full CRUD
const RO = ["read"]; // read-only

/**
 * Permission matrix: role -> resource -> allowed actions.
 * Anything not listed is implicitly denied.
 */
const MATRIX = {
  [ROLES.FLEET_MANAGER]: {
    vehicle: ALL, driver: ALL, trip: ALL, maintenance: ALL,
    fuel: ALL, expense: ALL, document: ALL, notification: ALL,
    report: ALL, user: ALL,
  },
  [ROLES.DISPATCHER]: {
    vehicle: RO, driver: RO, trip: ALL, maintenance: RO,
    fuel: RO, document: RO, notification: ["read", "update"],
  },
  [ROLES.SAFETY_OFFICER]: {
    vehicle: RO, driver: ALL, trip: RO, maintenance: ALL,
    document: ALL, notification: ["read", "update"], report: RO,
  },
  [ROLES.FINANCIAL_ANALYST]: {
    vehicle: RO, trip: RO, fuel: ALL, expense: ALL,
    report: ALL, notification: ["read", "update"], document: RO,
  },
};

function can(role, resource, action) {
  const allowed = MATRIX[role]?.[resource];
  return Array.isArray(allowed) && allowed.includes(action);
}

module.exports = { ROLES, RESOURCES, ACTIONS, MATRIX, can };