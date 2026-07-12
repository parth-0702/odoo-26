import { useFuelLogs } from "@/hooks/useResources";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { DataState } from "@/components/ui/DataState";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { formatCurrency, formatDate } from "@/lib/format";

export function Fuel() {
  const { data, loading, error, reload } = useFuelLogs();
  return (
    <div className="animate-fade-in-up">
      <PageHeader title="Fuel Logs" subtitle="Consumption & efficiency" />
      <DataState loading={loading} error={error} data={data} onRetry={reload}
        skeleton={<SkeletonRows rows={6} />} emptyIcon="ev_station" emptyTitle="No fuel logs">
        {(rows) => (
          <div className="space-y-2">
            {rows.map((f) => (
              <Card key={f._id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-variant/40 flex items-center justify-center shrink-0">
                  <Icon name="local_gas_station" className="text-[20px] text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-body-md text-on-surface font-medium">{f.liters} L · {f.station ?? "—"}</div>
                  <div className="text-[12px] text-on-surface-variant">{formatDate(f.date)} · {f.efficiencyKmpl ?? "—"} km/L</div>
                </div>
                <span className="text-data-tabular text-on-surface-variant">{formatCurrency(f.totalCost)}</span>
              </Card>
            ))}
          </div>
        )}
      </DataState>
    </div>
  );
}