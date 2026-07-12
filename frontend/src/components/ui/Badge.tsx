import type { ReactNode } from "react";
import clsx from "clsx";

type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "info" | "violet" | "sky";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-container text-on-surface-variant border-outline/40",
  primary: "bg-primary/10 text-primary border-primary",
  success: "bg-mint/20 text-[#0F7A57] border-[#0F9D6E]",
  warning: "bg-sunshine/40 text-[#7A5A00] border-[#B8860B]",
  danger: "bg-primary/10 text-primary border-primary",
  info: "bg-sky/15 text-[#2361C9] border-sky",
  violet: "bg-violet/15 text-[#5A3FE0] border-violet",
  sky: "bg-sky/15 text-[#2361C9] border-sky",
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
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase font-bold border-2 tracking-wide",
        tones[tone]
      )}
    >
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {children}
    </span>
  );
}
