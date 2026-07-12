import { useMemo } from "react";
import { useTrips } from "@/hooks/useResources";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { DataState } from "@/components/ui/DataState";
import { SkeletonRows } from "@/components/ui/Skeleton";
import type { Trip, TripStatus } from "@/types";

const COLUMNS: { status: TripStatus; label: string }[] = [
  { status: "queued", label: "Queued" },
  { status: "dispatched", label: "Dispatched" },
  { status: "in_transit", label: "In Transit" },
  { status: "delayed", label: "Delayed" },
];

const priorityTone: Record<Trip["priority"], "neutral" | "info" | "warning" | "danger"> = {
  low: "neutral", normal: "info", high: "warning", urgent: "danger",
};

export function Trips() {
  const { data, loading, error, reload } = useTrips();

  const byStatus = useMemo(() => {
    const map: Record<string, Trip[]> = {};
    (data ?? []).forEach((t) => (map[t.status] ||= []).push(t));
    return map;
  }, [data]);

  return (
    <div className="animate-fade-in-up">
      <PageHeader title="Dispatch & Trips" subtitle="Live operations queue" />
      <DataState
        loading={loading}
        error={error}
        data={data}
        onRetry={reload}
        skeleton={<SkeletonRows rows={6} />}
        emptyIcon="route"
        emptyTitle="No trips scheduled"
      >
        {() => (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-md">
            {COLUMNS.map((col) => (
              <div key={col.status} className="flex flex-col">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-body-md font-headline text-on-surface">{col.label}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-variant/40 text-on-surface-variant">
                    {(byStatus[col.status] ?? []).length}
                  </span>
                </div>
                <div className="space-y-2 min-h-[80px]">
                  {(byStatus[col.status] ?? []).map((t) => (
                    <Card key={t._id} className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-body-md text-on-surface font-medium">{t.reference}</span>
                        <Badge tone={priorityTone[t.priority]}>{t.priority}</Badge>
                      </div>
                      <div className="flex items-center gap-1 text-[12px] text-on-surface-variant">
                        <Icon name="trip_origin" className="text-[14px]" />
                        <span className="truncate">{t.origin}</span>
                        <Icon name="arrow_right_alt" className="text-[14px]" />
                        <span className="truncate">{t.destination}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-[11px] text-on-surface-variant">
                        <span>{t.distanceKm} km</span>
                        {t.etaMinutes != null && <span>ETA {t.etaMinutes}m</span>}
                      </div>
                    </Card>
                  ))}
                  {(byStatus[col.status] ?? []).length === 0 && (
                    <div className="text-center text-[12px] text-on-surface-variant/50 py-md border border-dashed border-white/5 rounded-lg">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DataState>
    </div>
  );
}