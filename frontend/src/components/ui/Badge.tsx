import type { ReactNode } from "react";
import clsx from "clsx";

type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-variant/40 text-on-surface-variant border-white/10",
  primary: "bg-primary-container/20 text-primary border-primary/30",
  success: "bg-secondary-container/30 text-secondary border-secondary/30",
  warning: "bg-tertiary/15 text-tertiary border-tertiary/30",
  danger: "bg-error-container/30 text-error border-error/30",
  info: "bg-white/5 text-on-surface-variant border-white/10",
};

export function Badge({
  tone = "neutral",
  children,
  pulse = false,
}: {
  tone?: Tone;
  children: ReactNode;
  pulse?: boolean;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] uppercase font-bold border tracking-wide",
        tones[tone]
      )}
    >
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {children}
    </span>
  );
}