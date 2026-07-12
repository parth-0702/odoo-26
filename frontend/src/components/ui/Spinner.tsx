export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-block w-5 h-5 rounded-full border-[3px] border-outline/15 border-t-primary animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function FullscreenLoader({ label = "Loading command center…" }: { label?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-background px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(rgba(43,43,47,0.08) 1.4px, transparent 1.4px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative w-full max-w-lg">
        <div className="relative h-40 rounded-[2rem] bg-surface border-[3px] border-outline shadow-pop-lg overflow-hidden flex items-center justify-center">
          <div className="absolute inset-x-0 bottom-8 h-1 bg-outline/15" />
          <div className="absolute inset-x-0 bottom-[38px] h-2 bg-[repeating-linear-gradient(90deg,rgba(43,43,47,0.5)_0,rgba(43,43,47,0.5)_28px,transparent_28px,transparent_54px)] opacity-60 animate-[scan-line_1.9s_linear_infinite]" />
          <div className="relative flex items-center gap-3 text-primary motion-safe-ui animate-float-gentle">
            <div className="w-14 h-14 rounded-2xl bg-primary border-2 border-outline flex items-center justify-center shadow-pop-sm">
              <span className="material-symbols-outlined text-[28px] text-white">local_shipping</span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col items-center gap-3 text-center">
        <Spinner className="w-8 h-8" />
        <p className="text-body-md font-semibold text-on-surface-variant tracking-wide">{label}</p>
      </div>
    </div>
  );
}
