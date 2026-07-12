import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export function Card({
  children,
  className,
  glass = true,
  ...props
}: {
  children: ReactNode;
  className?: string;
  glass?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={clsx(
        "rounded-2xl p-md motion-safe-ui",
        glass ? "glass-panel" : "bg-surface-container border border-white/6 shadow-[0_8px_24px_rgba(0,0,0,0.14)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-md border-b border-white/6 pb-sm">
      <h3 className="text-body-lg font-headline font-semibold text-on-surface">{title}</h3>
      {action}
    </div>
  );
}