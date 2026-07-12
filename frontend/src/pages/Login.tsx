import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { BRAND } from "@/config/brand";
import { ROLE_LABELS, ROLE_DESCRIPTIONS } from "@/config/permissions";
import { Icon } from "@/components/ui/Icon";
import type { Role } from "@/types";

const ROLE_ICONS: Record<Role, string> = {
  admin: "shield_person",
  fleet_manager: "local_shipping",
  driver: "badge",
  staff: "groups",
};

/**
 * Simple role switcher — no real authentication yet. Selecting a role signs
 * you in as the demo user for that role so you can see how CRUD access
 * differs across Admin / Fleet Manager / Driver / Staff.
 */
export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [loadingRole, setLoadingRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectRole = async (role: Role) => {
    setLoadingRole(role);
    setError(null);
    try {
      await login("", "", role);
      navigate(from, { replace: true });
    } catch {
      setError("Couldn't sign in. Please try again.");
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-md relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(229,57,53,0.12),transparent_24%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_20%)]" />
      <div className="w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.45)] border border-white/6 page-enter relative bg-surface/85 backdrop-blur-xl p-lg sm:p-xl">
        <div className="flex items-center gap-3 mb-lg">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(229,57,53,0.28)]">
            <Icon name="local_shipping" className="text-white text-[20px]" filled />
          </div>
          <div>
            <div className="font-display text-body-lg font-bold text-on-surface leading-none">
              {BRAND.name} TMS
            </div>
            <div className="text-[11px] uppercase tracking-wider text-on-surface-variant mt-1">
              Transport Management System
            </div>
          </div>
        </div>

        <h2 className="text-headline-md font-display font-bold text-on-surface mb-1">Select Your Role</h2>
        <p className="text-body-md text-on-surface-variant mb-lg">
          This is a demo role switcher — pick a role to see the fleet console with that role's access.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          {(Object.keys(ROLE_LABELS) as Role[]).map((role) => (
            <button
              key={role}
              onClick={() => selectRole(role)}
              disabled={loadingRole !== null}
              className="text-left p-md rounded-2xl border border-black/[0.08] bg-surface-variant/20 hover:border-primary/40 hover:bg-primary-container/10 transition-all disabled:opacity-50 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary/25 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                  {loadingRole === role ? (
                    <span className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                  ) : (
                    <Icon name={ROLE_ICONS[role]} className="text-[20px]" filled />
                  )}
                </div>
                <span className="text-body-lg font-headline font-semibold text-on-surface">
                  {ROLE_LABELS[role]}
                </span>
              </div>
              <p className="text-[12px] text-on-surface-variant">{ROLE_DESCRIPTIONS[role]}</p>
            </button>
          ))}
        </div>

        {error && <p className="text-body-md text-error mt-md">{error}</p>}

        <div className="flex items-center gap-1.5 mt-lg pt-md border-t border-black/[0.06] text-[11px] text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-success" />
          System Online · Demo mode (no password required)
        </div>
      </div>
    </div>
  );
}
