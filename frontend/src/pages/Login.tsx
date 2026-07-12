import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { BRAND } from "@/config/brand";
import { ROLE_LABELS, ROLE_DESCRIPTIONS } from "@/config/permissions";
import { Icon } from "@/components/ui/Icon";
import { StarDoodle, ScribbleDoodle, BlobDoodle, CircleDoodle, PlusDoodle, SparkleDoodle } from "@/components/ui/Doodles";
import type { Role } from "@/types";

const ROLE_ICONS: Record<Role, string> = {
  admin: "shield_person",
  fleet_manager: "local_shipping",
  driver: "badge",
  staff: "groups",
};

const CARD_ACCENTS: Record<Role, string> = {
  admin: "bg-sunshine/40",
  fleet_manager: "bg-mint/30",
  driver: "bg-sky/25",
  staff: "bg-violet/20",
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
    <div className="min-h-screen bg-background flex items-center justify-center p-md sm:p-xl relative overflow-hidden">
      {/* Background doodles */}
      <BlobDoodle color="#7B61FF" className="absolute -top-16 -left-20 w-96 h-96 animate-float-slow" />
      <BlobDoodle color="#B5121B" className="absolute -bottom-24 -right-16 w-[28rem] h-[28rem] animate-float-slow" style={{ animationDelay: "1.5s" }} />
      <StarDoodle color="#FFD84D" className="hidden sm:block absolute top-16 right-[14%] w-10 h-10 animate-wiggle" />
      <StarDoodle color="#38D9A9" className="hidden sm:block absolute bottom-24 left-[10%] w-8 h-8 animate-wiggle" style={{ animationDelay: "0.8s" }} />
      <CircleDoodle color="#2B2B2F" className="hidden md:block absolute top-[20%] left-[6%] w-16 h-16 opacity-30 animate-spin-slow" />
      <PlusDoodle color="#4D96FF" className="hidden md:block absolute bottom-[18%] right-[8%] w-6 h-6" />
      <SparkleDoodle color="#B5121B" className="hidden sm:block absolute top-[38%] right-[5%] w-6 h-6 animate-wiggle" />

      <div className="w-full max-w-3xl relative">
        <div className="rounded-[2rem] overflow-hidden border-[3px] border-outline shadow-pop-lg bg-surface p-lg sm:p-xl relative">
          {/* Header */}
          <div className="flex items-center gap-3 mb-lg">
            <div className="w-12 h-12 rounded-2xl bg-primary border-2 border-outline flex items-center justify-center shrink-0 shadow-pop-sm">
              <Icon name="local_shipping" className="text-white text-[22px]" filled />
            </div>
            <div>
              <div className="font-display text-body-lg font-bold text-on-surface leading-none">
                {BRAND.name} TMS
              </div>
              <div className="text-[11px] uppercase tracking-wider text-on-surface-variant mt-1 font-bold">
                Transport Management System
              </div>
            </div>
            <span className="ml-auto sticker-tag bg-mint/20 text-[#0F7A57] border-[#0F9D6E] hidden sm:inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" /> Online
            </span>
          </div>

          <div className="relative mb-lg">
            <h1 className="text-headline-lg sm:text-display-lg font-display font-bold text-on-surface tracking-tight leading-[1.02]">
              Who's <span className="relative inline-block text-primary">driving
                <ScribbleDoodle className="absolute left-0 -bottom-2 w-full h-3" color="#B5121B" />
              </span> today?
            </h1>
            <p className="text-body-md text-on-surface-variant mt-3 max-w-md">
              This is a demo role switcher — pick a role to see the fleet command center with that role's access.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            {(Object.keys(ROLE_LABELS) as Role[]).map((role, i) => (
              <button
                key={role}
                onClick={() => selectRole(role)}
                disabled={loadingRole !== null}
                className={`text-left p-md rounded-2xl border-2 border-outline transition-all duration-150 ease-out disabled:opacity-50 group relative overflow-hidden ${CARD_ACCENTS[role]} hover:-translate-y-1 hover:-translate-x-0.5 hover:shadow-pop shadow-pop-sm stagger-item`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-xl bg-surface border-2 border-outline flex items-center justify-center text-on-surface group-hover:rotate-6 transition-transform">
                    {loadingRole === role ? (
                      <span className="w-4 h-4 rounded-full border-2 border-outline/30 border-t-primary animate-spin" />
                    ) : (
                      <Icon name={ROLE_ICONS[role]} className="text-[20px]" filled />
                    )}
                  </div>
                  <span className="text-body-lg font-headline font-bold text-on-surface">
                    {ROLE_LABELS[role]}
                  </span>
                </div>
                <p className="text-[12px] text-on-surface-variant font-medium">{ROLE_DESCRIPTIONS[role]}</p>
              </button>
            ))}
          </div>

          {error && (
            <p className="text-body-md text-primary mt-md font-semibold">{error}</p>
          )}

          <div className="flex items-center gap-1.5 mt-lg pt-md border-t-2 border-outline/10 text-[11px] font-bold text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-success" />
            System Online · Demo mode (no password required)
          </div>
        </div>
      </div>
    </div>
  );
}
