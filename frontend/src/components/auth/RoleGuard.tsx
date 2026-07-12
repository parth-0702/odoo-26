import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { Action, Resource } from "@/config/permissions";

/**
 * Route-level guard: renders children only if the current role can perform
 * `action` on `resource`. Otherwise redirects to /unauthorized.
 */
export function RoleGuard({
  resource,
  action = "read",
  children,
}: {
  resource: Resource;
  action?: Action;
  children: ReactNode;
}) {
  const { can } = useAuth();
  if (!can(resource, action)) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}