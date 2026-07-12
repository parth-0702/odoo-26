/**
 * Centralized RBAC configuration (single source of truth for the backend).
 * Mirrored on the frontend at frontend/src/config/permissions.ts — keep both
 * in sync when adding roles, resources, or actions.
 */

const ROLES = {
  ADMIN: "admin",
  FLEET_MANAGER: "fleet_manager",
  DRIVER: "driver",
  SAFETY_OFFICER: "safety_officer",
  FINANCIAL_ANALYST: "financial_analyst",
  STAFF: "staff",
};

const ROLE_VALUES = Object.values(ROLES);

// Resources map 1:1 to the domain models.
const RESOURCES = [
  "vehicle",
  "driver",
  "trip",
  "shipment",
  "maintenance",
  "fuel",
  "expense",
  "document",
  "notification",
  "report",
  "user",
  "gps",
  "analytics",
];

const ACTIONS = ["read", "create", "update", "delete"];

const ALL = ACTIONS; // convenience: full CRUD
const RO = ["read"]; // read-only
const RU = ["read", "update"]; // read + update, no create/delete

/**
 * Permission matrix: role -> resource -> allowed actions.
 */
const MATRIX = {
  [ROLES.ADMIN]: {
    vehicle: ALL, driver: ALL, trip: ALL, shipment: ALL, maintenance: ALL,
    fuel: ALL, expense: ALL, document: ALL, notification: ALL,
    report: ALL, user: ALL, gps: ALL, analytics: ALL,
  },
  [ROLES.FLEET_MANAGER]: {
    vehicle: ALL, driver: ALL, trip: ALL, shipment: ALL, maintenance: ALL,
    document: ALL, fuel: RO, expense: ALL, report: RO,
    notification: RU, gps: ALL, analytics: RO,
  },
  [ROLES.DRIVER]: {
    vehicle: RO, driver: RO, trip: RU, shipment: RU,
    document: RO, notification: RU, expense: ["read", "create"],
    fuel: ["read", "create"], gps: RO,
  },
  [ROLES.SAFETY_OFFICER]: {
    vehicle: RU, driver: ALL, trip: RO, shipment: RO,
    maintenance: ALL, document: RO, notification: RU,
    gps: RO, analytics: RO,
  },
  [ROLES.FINANCIAL_ANALYST]: {
    vehicle: RO, driver: RO, trip: RO, shipment: RO,
    fuel: ALL, expense: ALL, report: RO, analytics: ALL,
  },
  [ROLES.STAFF]: {
    vehicle: RO, driver: RO, trip: RO, shipment: RO,
    maintenance: RO, document: RO, notification: RU,
    gps: RO,
  },
};

function can(role, resource, action) {
  const allowed = MATRIX[role]?.[resource];
  return Array.isArray(allowed) && allowed.includes(action);
}

module.exports = { ROLES, ROLE_VALUES, RESOURCES, ACTIONS, MATRIX, can };
