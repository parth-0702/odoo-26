import { Icon } from "./Icon";
import clsx from "clsx";
import { useCountUp } from "@/hooks/useCountUp";

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

  return (
    <div className="glass-panel rounded-2xl p-md flex items-center gap-md motion-safe-ui stagger-item card-hover cursor-default group" style={{ animationDelay: `${delay}ms` }}>
      <div className={clsx(
        "w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:shadow-[0_0_16px_currentColor]", 
        toneStyles[tone]
      )}>
        <Icon name={icon} className="text-headline-md transition-transform duration-500 group-hover:rotate-6" filled />
      </div>
      <div>
        <div className="text-label-caps uppercase text-on-surface-variant mb-1 tracking-wider">{label}</div>
        <div className="text-headline-md font-headline font-bold text-on-surface tabular-nums">
          {displayString}
        </div>
      </div>
    </div>
  );
}