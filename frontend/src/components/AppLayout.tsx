import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/ui/Icon";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import type { ModuleName } from "@/types";

const NAV_ITEMS: { to: string; label: string; icon: string; module: ModuleName }[] = [
  { to: "/drivers", label: "Drivers", icon: "badge", module: "driver" },
  { to: "/vehicles", label: "Vehicles", icon: "local_shipping", module: "vehicle" },
  { to: "/routes", label: "Routes", icon: "route", module: "route" },
  { to: "/shipments", label: "Shipments", icon: "package_2", module: "shipment" },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { can } = useAuth();
  const visibleItems = NAV_ITEMS.filter((item) => can(item.module, "read"));

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-black/[0.06] bg-white/70 backdrop-blur-xl px-4 py-6">
        <div className="flex items-center gap-2 px-2 mb-8">
          <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
            A
          </span>
          <span className="font-headline font-bold text-on-surface">ARJUNA TMS</span>
        </div>
        <nav className="flex flex-col gap-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 h-10 rounded-lg text-body-md transition-colors",
                  isActive
                    ? "bg-primary-container/25 text-primary font-medium"
                    : "text-on-surface-variant hover:bg-black/[0.03] hover:text-on-surface"
                )
              }
            >
              <Icon name={item.icon} className="text-[20px]" />
              {item.label}
            </NavLink>
          ))}
          {visibleItems.length === 0 && (
            <p className="px-3 text-[12px] text-on-surface-variant">No modules available for this role.</p>
          )}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between gap-4 px-4 md:px-8 h-16 border-b border-black/[0.06] bg-white/70 backdrop-blur-xl sticky top-0 z-10">
          <div className="md:hidden flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">
              A
            </span>
            <span className="font-headline font-bold text-on-surface text-sm">ARJUNA TMS</span>
          </div>
          <div className="hidden md:block" />
          <RoleSwitcher />
        </header>

        <nav className="md:hidden flex items-center gap-1 px-4 py-2 border-b border-black/[0.06] overflow-x-auto scrollbar-hide bg-white/60">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-1.5 px-3 h-9 rounded-full text-[12px] whitespace-nowrap border transition-colors",
                  isActive
                    ? "bg-primary-container/25 text-primary border-primary/30 font-medium"
                    : "text-on-surface-variant border-black/10"
                )
              }
            >
              <Icon name={item.icon} className="text-[16px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
