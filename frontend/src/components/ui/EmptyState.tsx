import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { CircleDoodle, StarDoodle } from "./Doodles";

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
    <div className="flex flex-col items-center justify-center text-center py-xl px-md motion-safe-ui">
      <div className="relative w-20 h-20 mb-md">
        <CircleDoodle className="absolute inset-0 w-full h-full animate-spin-slow" color="#D8D8D8" />
        <div className="absolute inset-2 rounded-full bg-surface-container border-2 border-outline flex items-center justify-center animate-float-slow">
          <Icon name={icon} className="text-[26px] text-on-surface-variant" />
        </div>
        <StarDoodle className="absolute -top-1 -right-1 w-6 h-6" color="#FFD84D" />
      </div>
      <h3 className="text-body-lg font-headline font-bold text-on-surface">{title}</h3>
      {description && (
        <p className="text-body-md text-on-surface-variant mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-md">{action}</div>}
    </div>
  );
}
