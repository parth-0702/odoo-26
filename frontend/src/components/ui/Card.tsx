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
        "rounded-2xl p-md motion-safe-ui bg-surface border-[2.5px] border-outline",
        glass ? "shadow-pop" : "shadow-pop-lg",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-md border-b-2 border-outline/10 pb-sm">
      <h3 className="text-body-lg font-headline font-bold text-on-surface">{title}</h3>
      {action}
    </div>
  );
}
