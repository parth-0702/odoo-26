import { useMaintenance } from "@/hooks/useResources";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { DataState } from "@/components/ui/DataState";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { maintenanceStatusTone } from "@/lib/status";
import { titleCase, formatDate, formatCurrency } from "@/lib/format";

const severityTone = { low: "neutral", medium: "info", high: "warning", critical: "danger" } as const;

export function Maintenance() {
  const { data, loading, error, reload } = useMaintenance();

  return (
    <div className="animate-fade-in-up">
      <PageHeader title="Maintenance Center" subtitle="Service assessments & work orders" />
      <DataState
        loading={loading}
        error={error}
        data={data}
        onRetry={reload}
        skeleton={<SkeletonRows rows={6} />}
        emptyIcon="build"
        emptyTitle="No maintenance records"
      >
        {(rows) => (
          <div className="space-y-2">
            {rows.map((m) => (
              <Card key={m._id} className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-variant/40 flex items-center justify-center shrink-0">
                  <Icon name="build" className="text-[20px] text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-body-md text-on-surface font-medium">{m.title}</span>
                    <Badge tone={severityTone[m.severity]}>{m.severity}</Badge>
                  </div>
                  <div className="text-[12px] text-on-surface-variant">{titleCase(m.type)} · Due {formatDate(m.dueDate)}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-data-tabular text-on-surface-variant">{formatCurrency(m.cost)}</span>
                  <Badge tone={maintenanceStatusTone[m.status]}>{titleCase(m.status)}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </DataState>
    </div>
  );
}