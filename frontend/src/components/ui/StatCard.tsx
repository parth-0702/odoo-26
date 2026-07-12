import { Icon } from "./Icon";
import clsx from "clsx";

type Tone = "primary" | "tertiary" | "secondary" | "error" | "neutral";

const toneStyles: Record<Tone, string> = {
  primary: "bg-primary-container/20 border-primary/30 text-primary",
  tertiary: "bg-tertiary/20 border-tertiary/30 text-tertiary",
  secondary: "bg-secondary-container/20 border-secondary/30 text-secondary",
  error: "bg-error-container/20 border-error/30 text-error",
  neutral: "bg-surface-variant/40 border-outline-variant text-on-surface",
};

export function StatCard({
  icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: string;
  label: string;
  value: string | number;
  tone?: Tone;
}) {
  return (
    <div className="glass-panel rounded-xl p-md flex items-center gap-md">
      <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center border", toneStyles[tone])}>
        <Icon name={icon} className="text-headline-md" filled />
      </div>
      <div>
        <div className="text-label-caps uppercase text-on-surface-variant mb-1">{label}</div>
        <div className="text-headline-md font-headline font-bold text-on-surface">{value}</div>
      </div>
    </div>
  );
}