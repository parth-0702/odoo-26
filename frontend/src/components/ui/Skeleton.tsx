import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "shimmer-loader relative overflow-hidden rounded-md bg-white/[0.04]",
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-panel rounded-2xl p-md flex items-center gap-md motion-safe-ui">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}