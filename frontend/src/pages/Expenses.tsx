import { useExpenses } from "@/hooks/useResources";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataState } from "@/components/ui/DataState";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { titleCase, formatCurrency, formatDate } from "@/lib/format";

const statusTone = { pending: "warning", approved: "success", rejected: "danger" } as const;

export function Expenses() {
  const { data, loading, error, reload } = useExpenses();
  return (
    <div className="animate-fade-in-up">
      <PageHeader title="Expenses" subtitle="Cost tracking & approvals" />
      <DataState loading={loading} error={error} data={data} onRetry={reload}
        skeleton={<SkeletonRows rows={6} />} emptyIcon="payments" emptyTitle="No expenses">
        {(rows) => (
          <div className="space-y-2">
            {rows.map((e) => (
              <Card key={e._id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-body-md text-on-surface font-medium">{e.description}</div>
                  <div className="text-[12px] text-on-surface-variant">{titleCase(e.category)} · {formatDate(e.date)}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-data-tabular text-on-surface">{formatCurrency(e.amount, e.currency)}</span>
                  <Badge tone={statusTone[e.status]}>{titleCase(e.status)}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </DataState>
    </div>
  );
}