import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { BRAND } from "@/config/brand";
import { ROLE_LABELS } from "@/config/permissions";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { Role } from "@/types";

const DEMO: { role: Role; email: string; icon: string }[] = [
  { role: "fleet_manager", email: "manager@arjuna.io", icon: "hub" },
  { role: "dispatcher", email: "dispatch@arjuna.io", icon: "route" },
  { role: "safety_officer", email: "safety@arjuna.io", icon: "verified_user" },
  { role: "financial_analyst", email: "finance@arjuna.io", icon: "insights" },
];

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [role, setRole] = useState<Role>("fleet_manager");
  const [email, setEmail] = useState("manager@arjuna.io");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectRole = (r: Role, mail: string) => {
    setRole(r);
    setEmail(mail);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password, role);
      navigate(from, { replace: true });
    } catch {
      setError("Access denied. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex items-center justify-center p-md">
      <div className="absolute inset-0 map-bg" />
      <div className="relative w-full max-w-md glass-panel rounded-2xl p-xl border border-white/10 animate-fade-in-up">
        <div className="flex flex-col items-center text-center mb-lg">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-primary/40 glow-primary mb-md">
            <img src={BRAND.logoUrl} alt={BRAND.fullName} className="w-full h-full object-cover" />
          </div>
          <h1 className="font-display text-headline-md text-on-surface tracking-tight">{BRAND.name}</h1>
          <p className="text-body-md text-on-surface-variant mt-1">{BRAND.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-lg">
          {DEMO.map((d) => (
            <button
              key={d.role}
              type="button"
              onClick={() => selectRole(d.role, d.email)}
              className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                role === d.role
                  ? "border-primary/50 bg-primary-container/15 text-primary glow-active"
                  : "border-white/5 bg-surface-variant/30 text-on-surface-variant hover:border-white/20"
              }`}
            >
              <Icon name={d.icon} className="text-[20px]" />
              <span className="text-[12px] font-medium leading-tight">{ROLE_LABELS[d.role]}</span>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-md">
          <label className="block">
            <span className="text-label-caps uppercase text-on-surface-variant">Operator ID</span>
            <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-lg bg-surface-variant/30 border border-white/5 input-glow">
              <Icon name="mail" className="text-[18px] text-on-surface-variant" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none text-body-md text-on-surface"
                required
              />
            </div>
          </label>
          <label className="block">
            <span className="text-label-caps uppercase text-on-surface-variant">Access Key</span>
            <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-lg bg-surface-variant/30 border border-white/5 input-glow">
              <Icon name="lock" className="text-[18px] text-on-surface-variant" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent outline-none text-body-md text-on-surface"
                required
              />
            </div>
          </label>

          {error && <p className="text-body-md text-error">{error}</p>}

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? <Spinner /> : <><Icon name="login" className="text-[20px]" /> Enter Command Center</>}
          </Button>
        </form>

        <p className="text-[11px] text-on-surface-variant/60 text-center mt-md">
          Demo environment · select a role to preview its dashboard
        </p>
      </div>
    </div>
  );
}