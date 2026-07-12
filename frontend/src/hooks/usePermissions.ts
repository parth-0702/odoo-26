import { useAuth } from "@/context/AuthContext";
import { can } from "@/config/permissions";
import type { Resource, Action } from "@/config/permissions";

export function usePermissions() {
  const { role } = useAuth();

  return {
    /** Check if current role can perform action on resource. */
    can: (resource: Resource, action: Action): boolean => can(role, resource, action),

    /** Check if current role can perform ANY of the given actions on resource. */
    canAny: (resource: Resource, actions: Action[]): boolean =>
      actions.some(a => can(role, resource, a)),

    /** Check if current role can perform ALL of the given actions on resource. */
    canAll: (resource: Resource, actions: Action[]): boolean =>
      actions.every(a => can(role, resource, a)),

    role,
    isAdmin:            role === "admin",
    isFleetManager:     role === "fleet_manager",
    isDriver:           role === "driver",
    isSafetyOfficer:    role === "safety_officer",
    isFinancialAnalyst: role === "financial_analyst",
  };
}
