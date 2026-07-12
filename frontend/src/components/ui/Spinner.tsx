export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-block w-5 h-5 border-2 border-white/20 border-t-primary rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function FullscreenLoader({ label = "Loading command center…" }: { label?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-md bg-background">
      <Spinner className="w-8 h-8" />
      <p className="text-body-md text-on-surface-variant">{label}</p>
    </div>
  );
}