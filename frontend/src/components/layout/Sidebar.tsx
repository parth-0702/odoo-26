import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { navForRole, SECTION_LABELS, type NavItem } from "@/config/navigation";
import { ROLE_LABELS } from "@/config/permissions";
import { BRAND } from "@/config/brand";
import { Icon } from "@/components/ui/Icon";
import { initials } from "@/lib/format";
import clsx from "clsx";

/**
 * The sidebar is an intentionally dark "island" regardless of the app's light
 * theme (matches the reference design: charcoal nav rail + light content area).
 * It uses hardcoded dark colors rather than the semantic surface/on-surface
 * tokens, which are tuned for the light content area.
 */
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, role, logout } = useAuth();
  const items = navForRole(role);

  const sections = items.reduce<Record<string, NavItem[]>>((acc, item) => {
    (acc[item.section] ||= []).push(item);
    return acc;
  }, {});

  return (
    <aside className="w-[280px] h-full bg-secondary border-r border-black/20 flex flex-col fixed left-0 top-0 z-30">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-lg border-b border-white/10">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-primary flex items-center justify-center shrink-0">
          <img src={BRAND.logoUrl} alt={BRAND.fullName} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-display text-body-lg font-bold tracking-tight text-white leading-none">
            {BRAND.name}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-white/50 mt-1">
            Transport MS
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-md px-sm">
        {Object.entries(sections).map(([section, secItems]) => (
          <div key={section} className="mb-md">
            <div className="px-md mb-1 text-label-caps uppercase text-white/35">
              {SECTION_LABELS[section as NavItem["section"]]}
            </div>
            {secItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onNavigate}
                className={({ isActive }: { isActive: boolean }) =>
                  clsx(
                    "flex items-center gap-3 px-md py-2.5 rounded-lg text-body-md transition-colors mb-0.5 border",
                    isActive
                      ? "bg-primary text-white border-primary"
                      : "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
                  )
                }
              >
                <Icon name={item.icon} className="text-[20px]" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-md flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white text-data-tabular font-bold">
          {user ? initials(user.name) : "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-body-md text-white truncate">{user?.name}</div>
          <div className="text-[11px] text-white/50 truncate">
            {role ? ROLE_LABELS[role] : ""}
          </div>
        </div>
        <button
          onClick={logout}
          className="text-white/50 hover:text-primary transition-colors p-1"
          title="Sign out"
        >
          <Icon name="logout" className="text-[20px]" />
        </button>
      </div>
    </aside>
  );
}
