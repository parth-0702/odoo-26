import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useVehicles } from "@/hooks/useResources";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { DataState } from "@/components/ui/DataState";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { vehicleStatusTone } from "@/lib/status";
import { titleCase } from "@/lib/format";
import type { VehicleStatus } from "@/types";

const FILTERS: (VehicleStatus | "all")[] = ["all", "active", "idle", "in_maintenance", "flagged"];

export function Vehicles() {
  const { data, loading, error, reload } = useVehicles();
  const [filter, setFilter] = useState<VehicleStatus | "all">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      (data ?? []).filter(
        (v) =>
          (filter === "all" || v.status === filter) &&
          (v.registrationNumber.toLowerCase().includes(q.toLowerCase()) ||
            `${v.make} ${v.model}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [data, filter, q]
  );

  return (
    <div className="animate-fade-in-up">
      <PageHeader title="Vehicle Registry" subtitle="Fleet assets & telemetry" />

      <div className="flex flex-col sm:flex-row gap-sm mb-md">
        <div className="flex items-center gap-2 h-10 px-3 rounded-lg bg-surface-variant/30 border border-white/5 flex-1 max-w-sm">
          <Icon name="search" className="text-[18px] text-on-surface-variant" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search registration or model…"
            className="flex-1 bg-transparent outline-none text-body-md text-on-surface"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 h-10 rounded-lg text-data-tabular border transition-colors ${
                filter === f
                  ? "bg-primary-container/15 text-primary border-primary/30"
                  : "bg-surface-variant/20 text-on-surface-variant border-white/5 hover:border-white/20"
              }`}
            >
              {titleCase(f)}
            </button>
          ))}
        </div>
      </div>

      <DataState
        loading={loading}
        error={error}
        data={filtered}
        onRetry={reload}
        skeleton={<SkeletonRows rows={6} />}
        emptyIcon="local_shipping"
        emptyTitle="No vehicles found"
        emptyDescription="Adjust your filters or search."
      >
        {(rows) => (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
            {rows.map((v) => (
              <Link key={v._id} to={`/vehicles/${v._id}`}>
                <Card className="hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between mb-md">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-surface-variant/40 flex items-center justify-center border border-white/5">
                        <Icon name="local_shipping" className="text-[22px] text-primary" />
                      </div>
                      <div>
                        <div className="text-body-lg font-headline text-on-surface">{v.registrationNumber}</div>
                        <div className="text-[12px] text-on-surface-variant">{v.make} {v.model}</div>
                      </div>
                    </div>
                    <Badge tone={vehicleStatusTone[v.status]} pulse={v.status === "active"}>
                      {titleCase(v.status)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <Metric label="Health" value={`${v.healthScore}%`} />
                    <Metric label="Fuel" value={`${v.fuelLevel}%`} />
                    <Metric label="Odo" value={`${Math.round(v.odometer / 1000)}k`} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </DataState>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-variant/20 py-2">
      <div className="text-data-tabular text-on-surface font-medium">{value}</div>
      <div className="text-[10px] uppercase text-on-surface-variant">{label}</div>
    </div>
  );
}