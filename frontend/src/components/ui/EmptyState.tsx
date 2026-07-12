import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-xl px-md">
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center border border-black/[0.06] mb-md">
        <Icon name={icon} className="text-[28px] text-on-surface-variant" />
      </div>
      <h3 className="text-body-lg font-headline text-on-surface">{title}</h3>
      {description && (
        <p className="text-body-md text-on-surface-variant mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-md">{action}</div>}
    </div>
  );
}