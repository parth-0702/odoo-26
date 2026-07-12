import type { ReactNode } from "react";
import { ScribbleDoodle } from "./Doodles";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-md mb-lg">
      <div className="relative">
        <h1 className="text-headline-lg sm:text-display-lg font-display font-bold text-on-surface tracking-tight leading-[1.02]">
          {title}
        </h1>
        <ScribbleDoodle className="w-28 sm:w-36 h-auto -mt-1 opacity-90" />
        {subtitle && <p className="text-body-md text-on-surface-variant mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-sm">{actions}</div>}
    </div>
  );
}
