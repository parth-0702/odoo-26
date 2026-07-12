import type { ReactNode } from "react";
import clsx from "clsx";

export function Card({
  children,
  className,
  glass = true,
}: {
  children: ReactNode;
  className?: string;
  glass?: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-xl p-md",
        glass ? "glass-panel" : "bg-surface-container border border-black/[0.06]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-md border-b border-black/[0.06] pb-sm">
      <h3 className="text-body-lg font-headline font-semibold text-on-surface">{title}</h3>
      {action}
    </div>
  );
}