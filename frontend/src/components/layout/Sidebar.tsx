import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { navForRole, SECTION_LABELS, type NavItem } from "@/config/navigation";
import { ROLE_LABELS } from "@/config/permissions";
import { BRAND } from "@/config/brand";
import { Icon } from "@/components/ui/Icon";
import { initials } from "@/lib/format";
import clsx from "clsx";

/**
 * The sidebar is an intentionally solid charcoal "island" regardless of the
 * app's light editorial theme — matches the Memphis/Bento reference: bold
 * charcoal nav rail with a thick red brand mark + light content area.
 */
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, role, logout } = useAuth();
  const items = navForRole(role);

  const sections = items.reduce<Record<string, NavItem[]>>((acc, item) => {
    (acc[item.section] ||= []).push(item);
    return acc;
  }, {});

  return (
    <aside className="w-[280px] h-full bg-[#2B2B2F] border-r-[3px] border-[#2B2B2F] flex flex-col fixed left-0 top-0 z-30 shadow-pop-lg">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-lg border-b-2 border-white/10">
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary border-2 border-white/20 flex items-center justify-center shrink-0 shadow-[3px_3px_0_0_rgba(0,0,0,0.35)]">
          <img src={BRAND.logoUrl} alt={BRAND.fullName} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-display text-body-lg font-bold tracking-tight text-white leading-none">
            {BRAND.name}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-white/50 mt-1 font-bold">
            Transport MS
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-md px-sm">
        {Object.entries(sections).map(([section, secItems]) => (
          <div key={section} className="mb-md">
            <div className="px-md mb-1 text-label-caps uppercase text-white/35 font-bold">
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
                    "group relative flex items-center gap-3 px-md py-2.5 rounded-xl text-body-md font-semibold transition-all duration-200 ease-out mb-1 border-2 motion-safe-ui overflow-hidden",
                    isActive
                      ? "active bg-primary text-white border-white/20 shadow-[3px_3px_0_0_rgba(0,0,0,0.35)]"
                      : "text-white/65 hover:text-white hover:bg-white/8 border-transparent hover:translate-x-1"
                  )
                }
              >
                <Icon name={item.icon} className="text-[20px]" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t-2 border-white/10 p-md flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-sunshine border-2 border-white/20 flex items-center justify-center text-[#2B2B2F] text-data-tabular font-extrabold">
          {user ? initials(user.name) : "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-body-md text-white font-semibold truncate">{user?.name}</div>
          <div className="text-[11px] text-white/50 truncate">
            {role ? ROLE_LABELS[role] : ""}
          </div>
        </div>
        <button
          onClick={logout}
          className="text-white/50 hover:text-primary transition-all p-1.5 rounded-full hover:bg-white/10"
          title="Sign out"
        >
          <Icon name="logout" className="text-[20px]" />
        </button>
      </div>
    </aside>
  );
}
