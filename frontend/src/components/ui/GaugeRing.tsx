interface GaugeRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

function toneForScore(value: number): string {
  if (value >= 85) return "#6ADB9E"; // secondary
  if (value >= 65) return "#F9BD22"; // tertiary
  return "#FFB4AB"; // error
}

export function GaugeRing({ value, size = 64, strokeWidth = 6, label = "Safety" }: GaugeRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const color = toneForScore(clamped);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-body-lg font-headline font-bold text-on-surface leading-none" style={{ color }}>
          {Math.round(clamped)}
        </span>
        <span className="text-[8px] uppercase tracking-wide text-on-surface-variant mt-0.5">{label}</span>
      </div>
    </div>
  );
}
