/**
 * Single source of truth for role-based access control.
 *
 * ROLES:
 *   admin          - full control of everything
 *   fleet_manager  - manages day-to-day fleet data, cannot delete records
 *   driver         - read-only, plus can update the status of routes/shipments
 *                    while they're on the move
 *   staff          - read-only, plus can create shipment bookings
 *
 * MODULES: driver, vehicle, route, shipment
 *
 * Permission strings are any combination of the letters c/r/u/d
 * (create, read, update, delete).
 */

const ROLES = ["admin", "fleet_manager", "driver", "staff"];

const MODULES = ["driver", "vehicle", "route", "shipment"];

const PERMISSIONS = {
  driver: {
    admin: "crud",
    fleet_manager: "cru",
    driver: "r",
    staff: "r",
  },
  vehicle: {
    admin: "crud",
    fleet_manager: "cru",
    driver: "r",
    staff: "r",
  },
  route: {
    admin: "crud",
    fleet_manager: "cru",
    driver: "ru",
    staff: "r",
  },
  shipment: {
    admin: "crud",
    fleet_manager: "cru",
    driver: "ru",
    staff: "cr",
  },
};

const ACTION_CODE = {
  create: "c",
  read: "r",
  update: "u",
  delete: "d",
};

function can(role, moduleName, action) {
  if (!role || !MODULES.includes(moduleName) || !ACTION_CODE[action]) return false;
  const allowed = PERMISSIONS[moduleName]?.[role] || "";
  return allowed.includes(ACTION_CODE[action]);
}

/** Returns { driver: { create, read, update, delete }, vehicle: {...}, ... } for a role */
function permissionsForRole(role) {
  const result = {};
  for (const moduleName of MODULES) {
    result[moduleName] = {
      create: can(role, moduleName, "create"),
      read: can(role, moduleName, "read"),
      update: can(role, moduleName, "update"),
      delete: can(role, moduleName, "delete"),
    };
  }
  return result;
}

module.exports = { ROLES, MODULES, PERMISSIONS, ACTION_CODE, can, permissionsForRole };
