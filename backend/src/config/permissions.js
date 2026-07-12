/**
 * Centralized RBAC configuration (single source of truth for the backend).
 * Mirrored on the frontend at frontend/src/config/permissions.ts — keep both
 * in sync when adding roles, resources, or actions.
 */

const ROLES = {
  ADMIN: "admin",
  FLEET_MANAGER: "fleet_manager",
  DRIVER: "driver",
  STAFF: "staff",
};

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
];

const ACTIONS = ["read", "create", "update", "delete"];

const ALL = ACTIONS; // convenience: full CRUD
const RO = ["read"]; // read-only
const RU = ["read", "update"]; // read + update, no create/delete

/**
 * Permission matrix: role -> resource -> allowed actions.
 * Anything not listed is implicitly denied.
 *
 *  - Admin:          full CRUD on every module.
 *  - Fleet Manager:  full CRUD on the core fleet modules (vehicles, drivers,
 *                     trips/routes, shipments, maintenance, documents);
 *                     read-only on finance/reporting.
 *  - Driver:         read-only on fleet data, can update the trips/shipments
 *                     assigned to them (e.g. progress status); no create/delete.
 *  - Staff:          read-only across the board (general visibility, no edits).
 */
const MATRIX = {
  [ROLES.ADMIN]: {
    vehicle: ALL, driver: ALL, trip: ALL, shipment: ALL, maintenance: ALL,
    fuel: ALL, expense: ALL, document: ALL, notification: ALL,
    report: ALL, user: ALL,
  },
  [ROLES.FLEET_MANAGER]: {
    vehicle: ALL, driver: ALL, trip: ALL, shipment: ALL, maintenance: ALL,
    document: ALL, fuel: RO, expense: RO, report: RO,
    notification: RU,
  },
  [ROLES.DRIVER]: {
    vehicle: RO, driver: RO, trip: RU, shipment: RU,
    document: RO, notification: RU,
  },
  [ROLES.STAFF]: {
    vehicle: RO, driver: RO, trip: RO, shipment: RO,
    maintenance: RO, document: RO, notification: RU,
  },
};

function can(role, resource, action) {
  const allowed = MATRIX[role]?.[resource];
  return Array.isArray(allowed) && allowed.includes(action);
}

module.exports = { ROLES, RESOURCES, ACTIONS, MATRIX, can };
