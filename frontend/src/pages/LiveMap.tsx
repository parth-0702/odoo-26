import { useMemo, useState } from "react";
import { useVehicles } from "@/hooks/useResources";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { vehicleStatusTone } from "@/lib/status";
import { titleCase } from "@/lib/format";
import type { Vehicle, VehicleStatus } from "@/types";
import clsx from "clsx";

const PIN_COLOR: Record<VehicleStatus, string> = {
  active: "#6ADB9E",
  idle: "#8D9199",
  in_maintenance: "#F9BD22",
  flagged: "#FFB4AB",
  retired: "#43474E",
};

const FILTERS: { key: VehicleStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "idle", label: "Idle" },
  { key: "in_maintenance", label: "Maintenance" },
  { key: "flagged", label: "Flagged" },
];

export function LiveMap() {
  const { data, loading } = useVehicles();
  const all = data ?? [];
  const [filter, setFilter] = useState<VehicleStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Vehicle | null>(null);

  const withCoords = useMemo(() => all.filter((v) => v.location?.x !== undefined && v.location?.y !== undefined), [all]);

  const filtered = withCoords.filter((v) => {
    const matchesFilter = filter === "all" || v.status === filter;
    const matchesQuery =
      query.trim() === "" ||
      v.registrationNumber.toLowerCase().includes(query.toLowerCase()) ||
      v.location?.label?.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const counts = {
    active: withCoords.filter((v) => v.status === "active").length,
    idle: withCoords.filter((v) => v.status === "idle").length,
    in_maintenance: withCoords.filter((v) => v.status === "in_maintenance").length,
    flagged: withCoords.filter((v) => v.status === "flagged").length,
    retired: withCoords.filter((v) => v.status === "retired").length,
  };

  return (
    <div className="animate-fade-in-up h-[calc(100vh-8rem)] relative rounded-xl overflow-hidden border border-white/5 map-bg">
      <div className="map-grid" />

      {/* Geofence rings for visual depth */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
        <div className="w-[70%] h-[70%] rounded-full border border-dashed border-primary/20" />
        <div className="absolute w-[40%] h-[40%] rounded-full border border-dashed border-primary/15" />
      </div>

      {/* Vehicle pins */}
      <div className="absolute inset-0">
        {filtered.map((v) => (
          <button
            key={v._id}
            onClick={() => setSelected(v)}
            className="absolute -translate-x-1/2 -translate-y-full group"
            style={{ left: `${v.location!.x}%`, top: `${v.location!.y}%` }}
            title={v.registrationNumber}
          >
            <div
              className={clsx(
                "w-8 h-8 rounded-full rounded-br-none rotate-45 border-2 border-white/20 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                selected?._id === v._id && "ring-2 ring-white/60 scale-110"
              )}
              style={{ background: PIN_COLOR[v.status] }}
            >
              <Icon name="local_shipping" className="text-[15px] -rotate-45 text-black/70" filled />
            </div>
            {v.status === "active" && (
              <span
                className="absolute inset-0 rounded-full rounded-br-none rotate-45 animate-ping opacity-40"
                style={{ background: PIN_COLOR[v.status] }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Selected vehicle popover */}
      {selected && (
        <div className="absolute bottom-4 left-4 sm:left-auto sm:right-4 z-20 w-[280px]">
          <Card className="!p-md relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-on-surface-variant hover:text-on-surface"
            >
              <Icon name="close" className="text-[18px]" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Icon name="local_shipping" className="text-primary text-[20px]" filled />
              <span className="text-body-lg font-headline text-on-surface">{selected.registrationNumber}</span>
            </div>
            <div className="text-[12px] text-on-surface-variant mb-2">{selected.make} {selected.model}</div>
            <div className="grid grid-cols-2 gap-2 text-[12px] mb-2">
              <div>
                <div className="text-on-surface-variant/70 uppercase text-[10px]">Speed</div>
                <div className="text-on-surface font-data-tabular">{selected.speedKmph ?? 0} km/h</div>
              </div>
              <div>
                <div className="text-on-surface-variant/70 uppercase text-[10px]">Fuel</div>
                <div className="text-on-surface font-data-tabular">{selected.fuelLevel}%</div>
              </div>
            </div>
            <div className="text-[12px] text-on-surface-variant mb-2">{selected.location?.label ?? "Unknown location"}</div>
            <Badge tone={vehicleStatusTone[selected.status]}>{titleCase(selected.status)}</Badge>
          </Card>
        </div>
      )}

      {/* Left panel: search + list */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-[340px] max-h-[calc(100%-2rem)] flex flex-col">
        <Card className="!p-md mb-3 shrink-0">
          <div className="flex items-center justify-between mb-md">
            <h3 className="text-body-lg font-headline text-on-surface">Live GPS Tracking</h3>
            <Badge tone="primary" pulse>{counts.active} live</Badge>
          </div>
          <div className="relative mb-3">
            <Icon name="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reg. no. or location…"
              className="w-full bg-surface-variant/20 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-[12px] text-on-surface placeholder:text-on-surface-variant/60 input-glow outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={clsx(
                  "px-2.5 py-1 rounded-full text-[11px] border transition-colors",
                  filter === f.key
                    ? "bg-primary-container/25 border-primary/40 text-primary"
                    : "bg-white/5 border-white/10 text-on-surface-variant hover:text-on-surface"
                )}
              >
                {f.label}
                {f.key !== "all" && <span className="ml-1 opacity-70">{counts[f.key as VehicleStatus]}</span>}
              </button>
            ))}
          </div>
        </Card>

        <Card className="!p-md flex-1 overflow-y-auto scrollbar-hide">
          {loading ? (
            <div className="flex justify-center py-md"><Spinner /></div>
          ) : (
            <div className="space-y-2">
              {filtered.map((v) => (
                <button
                  key={v._id}
                  onClick={() => setSelected(v)}
                  className={clsx(
                    "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors",
                    selected?._id === v._id ? "bg-primary-container/15 border border-primary/30" : "bg-surface-variant/20 border border-transparent hover:border-white/10"
                  )}
                >
                  <div className="min-w-0">
                    <div className="text-body-md text-on-surface truncate">{v.registrationNumber}</div>
                    <div className="text-[11px] text-on-surface-variant truncate">{v.location?.label ?? "In transit"}</div>
                  </div>
                  <Badge tone={vehicleStatusTone[v.status]}>{titleCase(v.status)}</Badge>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-[12px] text-on-surface-variant text-center py-4">No vehicles match your filters.</p>}
            </div>
          )}
        </Card>
      </div>

      {/* Legend */}
      <div className="hidden sm:flex absolute top-4 right-4 gap-3 bg-surface/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2">
        {(Object.keys(PIN_COLOR) as VehicleStatus[]).filter((s) => s !== "retired").map((s) => (
          <div key={s} className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
            <span className="w-2 h-2 rounded-full" style={{ background: PIN_COLOR[s] }} />
            {titleCase(s)}
          </div>
        ))}
      </div>
    </div>
  );
}
