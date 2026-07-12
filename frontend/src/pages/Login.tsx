import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { BRAND } from "@/config/brand";
import { ROLE_LABELS } from "@/config/permissions";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import type { Role } from "@/types";

const DEMO_EMAIL: Record<Role, string> = {
  fleet_manager: "manager@arjuna.io",
  dispatcher: "dispatch@arjuna.io",
  safety_officer: "safety@arjuna.io",
  financial_analyst: "finance@arjuna.io",
};

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [role, setRole] = useState<Role>("dispatcher");
  const [email, setEmail] = useState(DEMO_EMAIL.dispatcher);
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onRoleChange = (r: Role) => {
    setRole(r);
    setEmail(DEMO_EMAIL[r]);
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
    <div className="min-h-screen bg-background flex items-center justify-center p-md">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(20,20,25,0.12)] border border-black/[0.06] animate-fade-in-up">
        {/* Left: brand / atmosphere panel */}
        <div className="hidden md:flex relative flex-col justify-end p-lg min-h-[520px] bg-secondary overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full opacity-25"
            viewBox="0 0 400 520"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="yardFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#000000" stopOpacity="0" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={i} x={20 + i * 46} y={260} width="28" height="100" rx="3" fill="#ffffff" opacity={0.5} />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <circle key={`w1-${i}`} cx={30 + i * 46} cy={362} r="7" fill="#111214" />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <circle key={`w2-${i}`} cx={38 + i * 46} cy={362} r="7" fill="#111214" />
            ))}
            <rect x="0" y="0" width="400" height="520" fill="url(#yardFade)" />
          </svg>
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-md">
              <Icon name="local_shipping" className="text-white text-[20px]" filled />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white font-display font-bold text-body-lg">{BRAND.name} TMS</span>
            </div>
            <h1 className="text-white font-display text-headline-md font-bold leading-tight mb-2">
              Enterprise Logistics
            </h1>
            <p className="text-white/60 text-body-md max-w-xs">
              Command your fleet with precision and speed. The authoritative standard in transport management.
            </p>
          </div>
        </div>

        {/* Right: sign-in form */}
        <div className="bg-surface p-lg sm:p-xl flex flex-col justify-center relative">
          <div className="flex items-center justify-between mb-md">
            <div>
              <h2 className="text-headline-md font-display font-bold text-on-surface">Sign In</h2>
              <p className="text-body-md text-on-surface-variant mt-1">Enter your credentials to access the terminal.</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-md">
            <label className="block">
              <span className="text-label-caps uppercase text-on-surface-variant">Role</span>
              <div className="relative mt-1">
                <select
                  value={role}
                  onChange={(e) => onRoleChange(e.target.value as Role)}
                  className="w-full appearance-none h-11 px-3 rounded-lg bg-surface-container border border-black/10 text-body-md text-on-surface input-glow outline-none"
                >
                  {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
                <Icon name="expand_more" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant" />
              </div>
            </label>

            <label className="block">
              <span className="text-label-caps uppercase text-on-surface-variant">Email or Operator ID</span>
              <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-lg bg-surface-container border border-black/10 input-glow">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. OP-10492"
                  className="flex-1 bg-transparent outline-none text-body-md text-on-surface placeholder:text-on-surface-variant/60"
                  required
                />
              </div>
            </label>

            <label className="block">
              <div className="flex items-center justify-between">
                <span className="text-label-caps uppercase text-on-surface-variant">Password</span>
                <button type="button" className="text-[12px] text-primary hover:underline">Forgot password?</button>
              </div>
              <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-lg bg-surface-container border border-black/10 input-glow">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-body-md text-on-surface"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-on-surface-variant hover:text-on-surface"
                  aria-label="Toggle password visibility"
                >
                  <Icon name={showPassword ? "visibility_off" : "visibility"} className="text-[18px]" />
                </button>
              </div>
            </label>

            <label className="flex items-center gap-2 text-[12px] text-on-surface-variant">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-black/20 accent-[#B5121B]"
              />
              Remember this device
            </label>

            {error && <p className="text-body-md text-error">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-primary text-white font-semibold text-data-tabular flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
            >
              {loading ? <Spinner /> : <>AUTHENTICATE <Icon name="login" className="text-[18px]" /></>}
            </button>
          </form>

          <div className="flex items-center justify-between mt-lg pt-md border-t border-black/[0.06] text-[11px] text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success" />
              System Online
            </span>
            <span>v4.2.0-stable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
