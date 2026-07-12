import type { Role } from "@/types";
import type { Resource } from "./permissions";
import { can } from "./permissions";

export interface NavItem {
  label: string;
  path: string;
  icon: string; // Material Symbols name
  /** Visible only if the role can read this resource (undefined = always). */
  resource?: Resource;
  section: "operations" | "assets" | "finance" | "system";
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/", icon: "dashboard", section: "operations" },
  { label: "Live Map", path: "/live-map", icon: "map", section: "operations", resource: "vehicle" },
  { label: "Dispatch & Trips", path: "/trips", icon: "route", section: "operations", resource: "trip" },
  { label: "Vehicles", path: "/vehicles", icon: "local_shipping", section: "assets", resource: "vehicle" },
  { label: "Drivers", path: "/drivers", icon: "badge", section: "assets", resource: "driver" },
  { label: "Maintenance", path: "/maintenance", icon: "build", section: "assets", resource: "maintenance" },
  { label: "Documents", path: "/documents", icon: "folder_open", section: "assets", resource: "document" },
  { label: "Fuel Logs", path: "/fuel", icon: "ev_station", section: "finance", resource: "fuel" },
  { label: "Expenses", path: "/expenses", icon: "payments", section: "finance", resource: "expense" },
  { label: "Reports", path: "/reports", icon: "monitoring", section: "finance", resource: "report" },
  { label: "AI Insights", path: "/ai-insights", icon: "auto_awesome", section: "system", resource: "report" },
  { label: "Notifications", path: "/notifications", icon: "notifications", section: "system", resource: "notification" },
];

export const SECTION_LABELS: Record<NavItem["section"], string> = {
  operations: "Operations",
  assets: "Fleet Assets",
  finance: "Finance",
  system: "System",
};

/** Nav items the given role is allowed to see. */
export function navForRole(role: Role | undefined): NavItem[] {
  return NAV_ITEMS.filter((item) => !item.resource || can(role, item.resource, "read"));
}

/** Default landing route per role (their primary dashboard is always "/"). */
export function homeForRole(_role: Role | undefined): string {
  return "/";
}