import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useVehicles } from "@/hooks/useResources";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { DataState } from "@/components/ui/DataState";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { vehicleStatusTone } from "@/lib/status";
import { titleCase } from "@/lib/format";
import { vehicleService } from "@/services";
import type { VehicleStatus } from "@/types";

const FILTERS: (VehicleStatus | "all")[] = ["all", "active", "idle", "in_maintenance", "flagged"];

export function Vehicles() {
  const { can } = useAuth();
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
      <PageHeader
        title="Vehicle Registry"
        subtitle="Fleet assets & telemetry"
        actions={
          can("vehicle", "create") && (
            <Button variant="primary" onClick={() => handleAddVehicle(reload)}>
              <Icon name="add" className="text-[18px]" />
              Add vehicle
            </Button>
          )
        }
      />

      <div className="flex flex-col sm:flex-row gap-sm mb-md">
        <div className="flex items-center gap-2 h-10 px-3 rounded-lg bg-surface-variant/30 border border-black/[0.06] flex-1 max-w-sm">
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
                  : "bg-surface-variant/20 text-on-surface-variant border-black/10 hover:border-primary/30"
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
              <Card key={v._id} className="hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-md">
                  <Link to={`/vehicles/${v._id}`} className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-lg bg-surface-variant/40 flex items-center justify-center border border-black/[0.06] shrink-0">
                      <Icon name="local_shipping" className="text-[22px] text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-body-lg font-headline text-on-surface truncate">{v.registrationNumber}</div>
                      <div className="text-[12px] text-on-surface-variant truncate">{v.make} {v.model}</div>
                    </div>
                  </Link>
                  <div className="flex items-start gap-2">
                    <Badge tone={vehicleStatusTone[v.status]} pulse={v.status === "active"}>
                      {titleCase(v.status)}
                    </Badge>
                    {can("vehicle", "delete") && (
                      <button
                        onClick={() => handleDeleteVehicle(v._id, v.registrationNumber, reload)}
                        className="w-9 h-9 rounded-lg border border-outline/70 text-on-surface-variant hover:text-primary hover:border-primary/30 hover:bg-primary/5 flex items-center justify-center transition-colors"
                        aria-label={`Delete ${v.registrationNumber}`}
                        title="Delete vehicle"
                      >
                        <Icon name="delete" className="text-[18px]" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <Metric label="Health" value={`${v.healthScore}%`} />
                  <Metric label="Fuel" value={`${v.fuelLevel}%`} />
                  <Metric label="Odo" value={`${Math.round(v.odometer / 1000)}k`} />
                </div>
              </Card>
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

async function handleAddVehicle(reload: () => Promise<void>) {
  const registrationNumber = window.prompt("Registration number?");
  if (!registrationNumber) return;
  const make = window.prompt("Make?");
  if (!make) return;
  const model = window.prompt("Model?");
  if (!model) return;
  const type = window.prompt("Type (truck, van, bus, tanker, trailer, car)?", "truck");
  if (!type) return;

  const payload = {
    registrationNumber,
    make,
    model,
    type,
    status: "idle",
    odometer: Number(window.prompt("Odometer?", "0") ?? 0),
    fuelType: "diesel",
    fuelLevel: 100,
    healthScore: 100,
  };

  await vehicleService.create(payload as never);
  await reload();
}

async function handleDeleteVehicle(id: string, registrationNumber: string, reload: () => Promise<void>) {
  if (!window.confirm(`Delete vehicle ${registrationNumber}?`)) return;
  await vehicleService.remove(id);
  await reload();
}