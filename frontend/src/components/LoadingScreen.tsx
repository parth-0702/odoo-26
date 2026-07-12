import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/config/brand";

/**
 * CinematicLoader — Apple-level truck loading screen.
 *
 * Sequence:
 *  0.0s  → Background fades in, logo pops
 *  0.4s  → Company name rises up
 *  0.7s  → Highway appears, truck enters from left
 *  0.9s  → Truck acts as progress bar fill (0 → 100%)
 *  2.5s+ → At 100%: truck exits right, logo shrinks, overlay fades out
 *
 * Props:
 *  onDone — called when fade-out finishes (unmount trigger)
 */

interface Props {
  onDone: () => void;
}

const STEPS = [
  { pct: 8,  delay: 200  },
  { pct: 23, delay: 480  },
  { pct: 47, delay: 820  },
  { pct: 68, delay: 1200 },
  { pct: 81, delay: 1550 },
  { pct: 93, delay: 1900 },
  { pct: 100,delay: 2300 },
];

export function CinematicLoader({ onDone }: Props) {
  const [progress, setProgress]       = useState(0);
  const [phase, setPhase]             = useState<"enter" | "running" | "exit">("enter");
  const [truckExiting, setTruckExiting] = useState(false);
  const [fading, setFading]           = useState(false);
  const timeoutsRef                   = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const add = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timeoutsRef.current.push(t);
    };

    // Phase: highway + truck enters
    add(() => setPhase("running"), 700);

    // Progress steps
    STEPS.forEach(({ pct, delay }) => {
      add(() => setProgress(pct), delay);
    });

    // At 100%: exit sequence
    add(() => setTruckExiting(true), 2500);
    add(() => setFading(true), 2800);
    add(() => onDone(), 3250);

    return () => timeoutsRef.current.forEach(clearTimeout);
  }, [onDone]);

  // Truck X position: progress drives translation across the track
  // Track starts at ~8% and ends at ~88% of container width
  const truckLeft = 4 + (progress / 100) * 76; // 4% → 80%

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none
        ${fading ? "animate-loader-fade-out" : "animate-loader-fade-in"}`}
      style={{
        backgroundColor: "#F8F8F8",
        backgroundImage: "radial-gradient(rgba(43,43,47,0.09) 1.4px, transparent 1.4px)",
        backgroundSize: "22px 22px",
      }}
    >
      {/* Ambient accent blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 15% 15%, rgba(123,97,255,0.10) 0%, transparent 70%), " +
            "radial-gradient(ellipse 45% 35% at 90% 85%, rgba(181,18,27,0.08) 0%, transparent 65%)",
        }}
      />

      {/* ── Logo & Branding ─────────────────────────────────────────────────── */}
      <div className="relative flex flex-col items-center mb-10 z-10">
        {/* Logo badge */}
        <div
          className="w-20 h-20 rounded-2xl overflow-hidden border-[3px] border-[#2B2B2F] shadow-pop-lg mb-5"
          style={{
            animation: "logo-pop 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both",
            background: "#B5121B",
          }}
        >
          <img
            src={BRAND.logoUrl}
            alt={BRAND.fullName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Company name */}
        <h1
          className="text-[#2B2B2F] font-display font-bold tracking-tight text-2xl sm:text-3xl text-center"
          style={{ animation: "text-rise 0.7s cubic-bezier(0.22,1,0.36,1) 0.35s both" }}
        >
          {BRAND.name}
        </h1>
        <p
          className="text-[#63636A] text-xs sm:text-sm tracking-[0.2em] uppercase mt-1 font-body font-bold text-center"
          style={{ animation: "text-rise 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both" }}
        >
          Transport Management System
        </p>
      </div>

      {/* ── Road + Truck Scene ──────────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-2xl px-6 z-10"
        style={{ animation: "fade-in 0.5s ease 0.65s both" }}
      >
        {/* Road */}
        <div className="relative h-20 rounded-2xl overflow-hidden border-[3px] border-[#2B2B2F] shadow-pop" style={{ background: "#EDEDED" }}>
          {/* Road texture */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(90deg, transparent 0px, transparent 38px, rgba(43,43,47,0.06) 38px, rgba(43,43,47,0.06) 40px)",
            }}
          />
          {/* Center dashes — animated */}
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <line
              x1="0" y1="50%" x2="100%" y2="50%"
              stroke="rgba(43,43,47,0.18)"
              strokeWidth="2"
              strokeDasharray="30 20"
              style={{ animation: "road-dash 0.35s linear infinite" }}
            />
          </svg>

          {/* Progress fill — road that has been "covered" */}
          <div
            className="absolute inset-y-0 left-0 transition-none"
            style={{
              width: `${truckLeft + 6}%`,
              background:
                "linear-gradient(90deg, rgba(181,18,27,0.16) 0%, rgba(181,18,27,0.05) 100%)",
              transition: "width 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
          />

          {/* Truck SVG */}
          {phase !== "enter" && (
            <div
              className="absolute bottom-3"
              style={{
                left: `${truckLeft}%`,
                transform: "translateX(-50%)",
                transition: "left 0.38s cubic-bezier(0.22,1,0.36,1)",
                animation: truckExiting
                  ? "truck-exit 0.6s cubic-bezier(0.55,0,1,0.45) forwards"
                  : "suspension-bob 0.45s ease-in-out infinite",
              }}
            >
              <TruckSVG />
            </div>
          )}

          {/* Road edge reflection */}
          <div
            className="absolute inset-x-0 bottom-0 h-1"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            }}
          />
        </div>

        {/* ── Progress bar below road ──────────────────────────────────────── */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-[#2B2B2F]/10 overflow-hidden border border-[#2B2B2F]/15">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "#B5121B",
                transition: "width 0.38s cubic-bezier(0.22,1,0.36,1)",
              }}
            />
          </div>
          <span
            className="text-[#2B2B2F] font-mono text-xs w-8 text-right tabular-nums font-bold"
            style={{ animation: "count-up 0.3s ease both" }}
          >
            {progress}%
          </span>
        </div>

        {/* Loading label */}
        <p
          className="text-[#63636A] text-[11px] tracking-widest uppercase text-center mt-3 font-body font-bold"
          style={{ animation: "fade-in 0.5s ease 0.9s both" }}
        >
          {progress < 30 ? "Initialising systems…"
           : progress < 60 ? "Loading fleet data…"
           : progress < 90 ? "Connecting to operations…"
           : "Ready to launch"}
        </p>
      </div>
    </div>
  );
}

/** Inline SVG truck — wheels spin, headlights glow */
function TruckSVG() {
  return (
    <svg
      width="90" height="42"
      viewBox="0 0 90 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Chassis */}
      <rect x="2" y="14" width="72" height="20" rx="3" fill="#2a3540" />

      {/* Cab */}
      <rect x="58" y="6" width="28" height="28" rx="4" fill="#1e2d3a" />

      {/* Windshield */}
      <rect x="62" y="8" width="18" height="12" rx="2" fill="#0d2033" opacity="0.9" />

      {/* Window glare */}
      <rect x="63" y="9" width="6" height="3" rx="1" fill="rgba(255,255,255,0.15)" />

      {/* Body stripe */}
      <rect x="2" y="24" width="72" height="3" rx="1" fill="#B5121B" opacity="0.8" />

      {/* Headlight cone */}
      <ellipse
        cx="88" cy="22" rx="6" ry="5"
        fill="rgba(255,220,100,0.15)"
        style={{ animation: "headlight-flicker 1.5s ease-in-out infinite" }}
      />
      {/* Headlight */}
      <rect
        x="85" y="19" width="3" height="6" rx="1.5"
        fill="#FFD060"
        style={{ animation: "headlight-flicker 1.5s ease-in-out infinite" }}
      />

      {/* Tail lights */}
      <rect x="2" y="17" width="3" height="5" rx="1" fill="#ff3333" opacity="0.8" />

      {/* Exhaust pipe */}
      <rect x="10" y="4" width="3" height="10" rx="1.5" fill="#1a2530" />
      {/* Smoke */}
      <ellipse cx="11" cy="3" rx="3" ry="2.5" fill="rgba(180,190,200,0.25)"
        style={{ animation: "dust-puff 1.1s ease-out infinite" }} />

      {/* Wheel back */}
      <g style={{ transformOrigin: "16px 36px", animation: "wheel-spin 0.38s linear infinite" }}>
        <circle cx="16" cy="36" r="6" fill="#111" stroke="#444" strokeWidth="1.5" />
        <circle cx="16" cy="36" r="2" fill="#2a2a2a" />
        <line x1="16" y1="30" x2="16" y2="42" stroke="#3a3a3a" strokeWidth="1.2" />
        <line x1="10" y1="36" x2="22" y2="36" stroke="#3a3a3a" strokeWidth="1.2" />
      </g>

      {/* Wheel mid */}
      <g style={{ transformOrigin: "36px 36px", animation: "wheel-spin 0.38s linear infinite" }}>
        <circle cx="36" cy="36" r="6" fill="#111" stroke="#444" strokeWidth="1.5" />
        <circle cx="36" cy="36" r="2" fill="#2a2a2a" />
        <line x1="36" y1="30" x2="36" y2="42" stroke="#3a3a3a" strokeWidth="1.2" />
        <line x1="30" y1="36" x2="42" y2="36" stroke="#3a3a3a" strokeWidth="1.2" />
      </g>

      {/* Wheel front */}
      <g style={{ transformOrigin: "72px 34px", animation: "wheel-spin 0.38s linear infinite" }}>
        <circle cx="72" cy="34" r="5" fill="#111" stroke="#444" strokeWidth="1.5" />
        <circle cx="72" cy="34" r="1.8" fill="#2a2a2a" />
        <line x1="72" y1="29" x2="72" y2="39" stroke="#3a3a3a" strokeWidth="1.2" />
        <line x1="67" y1="34" x2="77" y2="34" stroke="#3a3a3a" strokeWidth="1.2" />
      </g>

      {/* Dust particles (emitted from rear wheels) */}
      <ellipse
        cx="10" cy="38" rx="4" ry="3"
        fill="rgba(160,170,180,0.3)"
        style={{ animation: "dust-puff 0.85s ease-out infinite" }}
      />
      <ellipse
        cx="6" cy="36" rx="2.5" ry="2"
        fill="rgba(160,170,180,0.2)"
        style={{ animation: "dust-puff 0.95s ease-out 0.15s infinite" }}
      />
    </svg>
  );
}
