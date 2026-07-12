import { useDocuments } from "@/hooks/useResources";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { DataState } from "@/components/ui/DataState";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { docStatusTone, DOC_TYPE_LABELS } from "@/lib/status";
import { titleCase, formatDate, daysUntil } from "@/lib/format";

export function Documents() {
  const { data, loading, error, reload } = useDocuments();

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Vehicle Documents"
        subtitle="Compliance & expiry tracking"
        actions={<Button variant="secondary"><Icon name="upload" className="text-[18px]" /> Upload</Button>}
      />
      <DataState
        loading={loading}
        error={error}
        data={data}
        onRetry={reload}
        skeleton={<SkeletonRows rows={6} />}
        emptyIcon="folder_open"
        emptyTitle="No documents"
      >
        {(rows) => (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
            {rows.map((d) => {
              const days = daysUntil(d.expiryDate);
              return (
                <Card key={d._id}>
                  <div className="flex items-start justify-between mb-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-variant/40 flex items-center justify-center">
                        <Icon name="description" className="text-[20px] text-primary" />
                      </div>
                      <div>
                        <div className="text-body-md text-on-surface font-medium">{DOC_TYPE_LABELS[d.docType] ?? titleCase(d.docType)}</div>
                        <div className="text-[12px] text-on-surface-variant">{d.documentNumber ?? "—"}</div>
                      </div>
                    </div>
                    <Badge tone={docStatusTone[d.status]}>{titleCase(d.status)}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[12px] pt-2 border-t border-white/5">
                    <span className="text-on-surface-variant">Expires {formatDate(d.expiryDate)}</span>
                    {days !== null && (
                      <span className={days < 0 ? "text-error" : days < 30 ? "text-tertiary" : "text-on-surface-variant"}>
                        {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </DataState>
    </div>
  );
}