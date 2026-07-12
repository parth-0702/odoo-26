import { Icon } from "./Icon";
import clsx from "clsx";
import { useCountUp } from "@/hooks/useCountUp";

type Tone = "primary" | "tertiary" | "secondary" | "error" | "neutral";

const toneStyles: Record<Tone, { wash: string; icon: string }> = {
  primary: { wash: "bg-primary/10", icon: "bg-primary text-white" },
  tertiary: { wash: "bg-violet/10", icon: "bg-violet text-white" },
  secondary: { wash: "bg-sky/10", icon: "bg-sky text-white" },
  error: { wash: "bg-tangerine/15", icon: "bg-tangerine text-on-surface" },
  neutral: { wash: "bg-mint/10", icon: "bg-mint text-on-surface" },
};

export function StatCard({
  icon,
  label,
  value,
  tone = "neutral",
  delay = 0,
}: {
  icon: string;
  label: string;
  value: string | number;
  tone?: Tone;
  delay?: number;
}) {
  const isNumeric = typeof value === 'number';
  const displayValueParts = typeof value === 'string' ? value.match(/([\D]*)([\d,.]+)([\D]*)/) : null;
  const numToAnimate = isNumeric ? value : (displayValueParts ? parseFloat(displayValueParts[2].replace(/,/g, '')) : 0);
  
  const animatedNum = useCountUp(numToAnimate, 1200);

  const displayString = isNumeric 
    ? animatedNum 
    : (displayValueParts && !isNaN(numToAnimate)
      ? `${displayValueParts[1]}${animatedNum.toLocaleString()}${displayValueParts[3]}`
      : value);

  const t = toneStyles[tone];

  return (
    <div
      className={clsx(
        "relative rounded-2xl p-md flex items-center gap-md motion-safe-ui stagger-item card-hover cursor-default group border-[2.5px] border-outline shadow-pop overflow-hidden",
        t.wash
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={clsx(
          "w-12 h-12 rounded-xl flex items-center justify-center border-2 border-outline shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-6 group-hover:scale-105",
          t.icon
        )}
      >
        <Icon name={icon} className="text-headline-md" filled />
      </div>
      <div className="min-w-0">
        <div className="text-label-caps uppercase text-on-surface-variant mb-1 tracking-wider truncate">{label}</div>
        <div className="text-headline-md font-headline font-bold text-on-surface tabular-nums leading-none">
          {displayString}
        </div>
      </div>
    </div>
  );
}
