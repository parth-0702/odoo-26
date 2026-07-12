interface MiniBarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  formatValue?: (v: number) => string;
}

export function MiniBarChart({ data, height = 120, color = "#FF6B00", formatValue }: MiniBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="w-full">
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d, i) => {
          const barHeight = Math.max(4, (d.value / max) * (height - 24));
          const isLast = i === data.length - 1;
          return (
            <div key={d.label} className="flex-1 flex flex-col items-center justify-end h-full group">
              <span className="text-[10px] text-on-surface-variant mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {formatValue ? formatValue(d.value) : d.value}
              </span>
              <div
                className="w-full rounded-t-sm transition-all"
                style={{
                  height: barHeight,
                  background: isLast ? color : `${color}55`,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-1">
        {data.map((d) => (
          <div key={d.label} className="flex-1 text-center text-[10px] text-on-surface-variant/70">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}
