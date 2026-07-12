export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-block w-5 h-5 rounded-full border-2 border-white/10 border-t-primary animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function FullscreenLoader({ label = "Loading command center…" }: { label?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-background px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(229,57,53,0.16),transparent_28%),radial-gradient(circle_at_50%_70%,rgba(255,255,255,0.04),transparent_22%)]" />
      <div className="relative w-full max-w-4xl">
        <div className="relative h-44 rounded-[2rem] glass-panel border border-white/8 overflow-hidden">
          <div className="absolute inset-x-0 bottom-10 h-16 bg-[linear-gradient(180deg,#1b2026_0%,#11151a_100%)]" />
          <div className="absolute inset-x-0 bottom-10 h-1 bg-white/10" />
          <div className="absolute inset-x-0 bottom-[54px] h-2 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.7)_0,rgba(255,255,255,0.7)_28px,transparent_28px,transparent_54px)] opacity-50 animate-[scan-line_1.9s_linear_infinite]" />
          <div className="absolute bottom-7 left-8 flex items-end gap-3 text-primary motion-safe-ui animate-float-gentle">
            <span className="material-symbols-outlined text-[30px]">local_shipping</span>
            <div className="h-10 w-10 rounded-full border border-primary/35 animate-pulse-ring" />
          </div>
        </div>
      </div>
      <div className="relative flex flex-col items-center gap-3 text-center">
        <Spinner className="w-8 h-8" />
        <p className="text-body-md text-on-surface-variant tracking-wide">{label}</p>
      </div>
    </div>
  );
}