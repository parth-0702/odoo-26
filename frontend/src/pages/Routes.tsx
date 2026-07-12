import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRoutes } from "@/hooks/useResources";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { DataState } from "@/components/ui/DataState";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { routeStatusTone } from "@/lib/status";
import { titleCase, formatDate } from "@/lib/format";
import { routeService } from "@/services";
import type { RouteStatus } from "@/types";
import clsx from "clsx";

const STATUSES: RouteStatus[] = ["planned", "in_progress", "completed", "delayed"];

export function RoutesPage() {
  const { can } = useAuth();
  const { data, loading, error, reload } = useRoutes();
  const [filter, setFilter] = useState<RouteStatus | "all">("all");

  const filtered = useMemo(() => {
    const rows = data ?? [];
    return filter === "all" ? rows : rows.filter((r) => r.status === filter);
  }, [data, filter]);

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Routes & Trips"
        subtitle="Plan and track journeys across drivers and vehicles"
        actions={
          can("route", "create") && (
            <Button variant="primary" onClick={() => handleAddRoute(reload)}>
              <Icon name="add" className="text-[18px]" />
              Add route
            </Button>
          )
        }
      />

      <div className="flex flex-wrap gap-1.5 mb-md">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={clsx(
              "px-3 py-1.5 rounded-full text-[12px] border transition-colors",
              filter === s
                ? "bg-primary-container/25 border-primary/40 text-primary"
                : "bg-black/[0.03] border-black/10 text-on-surface-variant hover:text-on-surface"
            )}
          >
            {s === "all" ? "All Routes" : titleCase(s)}
          </button>
        ))}
      </div>

      <DataState
        loading={loading}
        error={error}
        data={filtered}
        onRetry={reload}
        skeleton={<SkeletonRows rows={6} />}
        emptyIcon="route"
        emptyTitle="No routes found"
        emptyDescription="Adjust your filters, or add a new route."
      >
        {(rows) => (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
            {rows.map((r) => (
              <Card key={r._id}>
                <div className="flex items-start justify-between mb-md gap-2">
                  <div className="min-w-0">
                    <div className="text-body-lg font-headline text-on-surface truncate">{r.code}</div>
                    <div className="text-[12px] text-on-surface-variant truncate">
                      {r.origin} → {r.destination}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge tone={routeStatusTone[r.status]} pulse={r.status === "in_progress"}>
                      {titleCase(r.status)}
                    </Badge>
                    {can("route", "delete") && (
                      <button
                        onClick={() => handleDeleteRoute(r._id, r.code, reload)}
                        className="w-9 h-9 rounded-lg border border-outline/70 text-on-surface-variant hover:text-primary hover:border-primary/30 hover:bg-primary/5 flex items-center justify-center transition-colors"
                        aria-label={`Delete ${r.code}`}
                        title="Delete route"
                      >
                        <Icon name="delete" className="text-[18px]" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 text-[12px] mb-md">
                  <InfoRow icon="straighten" label="Distance" value={`${r.distanceKm} km`} />
                  <InfoRow icon="event" label="Scheduled" value={formatDate(r.scheduledDate)} />
                  <InfoRow icon="badge" label="Driver" value={r.assignedDriver?.name ?? "Unassigned"} />
                  <InfoRow
                    icon="local_shipping"
                    label="Vehicle"
                    value={r.assignedVehicle?.registrationNumber ?? "Unassigned"}
                  />
                </div>

                {can("route", "update") && (
                  <label className="flex items-center gap-2 text-[12px] text-on-surface-variant pt-2 border-t border-black/[0.06]">
                    Update status
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusChange(r._id, e.target.value as RouteStatus, reload)}
                      className="ml-auto h-8 px-2 rounded-lg border border-black/10 bg-white text-[12px] text-on-surface"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {titleCase(s)}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </Card>
            ))}
          </div>
        )}
      </DataState>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-on-surface-variant">
        <Icon name={icon} className="text-[14px]" />
        {label}
      </span>
      <span className="font-medium text-on-surface truncate max-w-[150px] text-right">{value}</span>
    </div>
  );
}

async function handleAddRoute(reload: () => Promise<void>) {
  const code = window.prompt("Route code? (e.g. RT-2001)");
  if (!code) return;
  const origin = window.prompt("Origin?");
  if (!origin) return;
  const destination = window.prompt("Destination?");
  if (!destination) return;
  const distanceKm = Number(window.prompt("Distance (km)?", "100") ?? 100);
  const scheduledDate = window.prompt("Scheduled date (YYYY-MM-DD)?", new Date().toISOString().slice(0, 10));
  if (!scheduledDate) return;

  await routeService.create({ code, origin, destination, distanceKm, scheduledDate, status: "planned" });
  await reload();
}

async function handleDeleteRoute(id: string, code: string, reload: () => Promise<void>) {
  if (!window.confirm(`Delete route ${code}?`)) return;
  await routeService.remove(id);
  await reload();
}

async function handleStatusChange(id: string, status: RouteStatus, reload: () => Promise<void>) {
  await routeService.update(id, { status });
  await reload();
}
