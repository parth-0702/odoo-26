import type { ReactNode } from "react";

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
      <div>
        <h1 className="text-headline-lg font-display text-on-surface tracking-tight">{title}</h1>
        {subtitle && <p className="text-body-md text-on-surface-variant mt-xs">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-sm">{actions}</div>}
    </div>
  );
}