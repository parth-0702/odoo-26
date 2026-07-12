import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useShipments } from "@/hooks/useResources";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { DataState } from "@/components/ui/DataState";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { shipmentStatusTone } from "@/lib/status";
import { titleCase } from "@/lib/format";
import { shipmentService } from "@/services";
import type { ShipmentStatus } from "@/types";
import clsx from "clsx";

const STATUSES: ShipmentStatus[] = ["booked", "in_transit", "delivered", "delayed", "cancelled"];

export function ShipmentsPage() {
  const { can } = useAuth();
  const { data, loading, error, reload } = useShipments();
  const [filter, setFilter] = useState<ShipmentStatus | "all">("all");

  const filtered = useMemo(() => {
    const rows = data ?? [];
    return filter === "all" ? rows : rows.filter((s) => s.status === filter);
  }, [data, filter]);

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Shipments"
        subtitle="Customer bookings and delivery status"
        actions={
          can("shipment", "create") && (
            <Button variant="primary" onClick={() => handleAddShipment(reload)}>
              <Icon name="add" className="text-[18px]" />
              Book shipment
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
            {s === "all" ? "All Shipments" : titleCase(s)}
          </button>
        ))}
      </div>

      <DataState
        loading={loading}
        error={error}
        data={filtered}
        onRetry={reload}
        skeleton={<SkeletonRows rows={6} />}
        emptyIcon="package_2"
        emptyTitle="No shipments found"
        emptyDescription="Adjust your filters, or book a new shipment."
      >
        {(rows) => (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
            {rows.map((s) => (
              <Card key={s._id}>
                <div className="flex items-start justify-between mb-md gap-2">
                  <div className="min-w-0">
                    <div className="text-body-lg font-headline text-on-surface truncate">{s.reference}</div>
                    <div className="text-[12px] text-on-surface-variant truncate">{s.customerName}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge tone={shipmentStatusTone[s.status]} pulse={s.status === "in_transit"}>
                      {titleCase(s.status)}
                    </Badge>
                    {can("shipment", "delete") && (
                      <button
                        onClick={() => handleDeleteShipment(s._id, s.reference, reload)}
                        className="w-9 h-9 rounded-lg border border-outline/70 text-on-surface-variant hover:text-primary hover:border-primary/30 hover:bg-primary/5 flex items-center justify-center transition-colors"
                        aria-label={`Delete ${s.reference}`}
                        title="Delete shipment"
                      >
                        <Icon name="delete" className="text-[18px]" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 text-[12px] mb-md">
                  <InfoRow icon="scale" label="Weight" value={`${s.weightKg} kg`} />
                  <InfoRow icon="priority_high" label="Priority" value={titleCase(s.priority)} />
                  <InfoRow icon="route" label="Route" value={s.route?.code ?? "Unassigned"} />
                  {s.description && <InfoRow icon="notes" label="Notes" value={s.description} />}
                </div>

                {can("shipment", "update") && (
                  <label className="flex items-center gap-2 text-[12px] text-on-surface-variant pt-2 border-t border-black/[0.06]">
                    Update status
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusChange(s._id, e.target.value as ShipmentStatus, reload)}
                      className="ml-auto h-8 px-2 rounded-lg border border-black/10 bg-white text-[12px] text-on-surface"
                    >
                      {STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {titleCase(st)}
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

async function handleAddShipment(reload: () => Promise<void>) {
  const reference = window.prompt("Shipment reference? (e.g. SHP-9010)");
  if (!reference) return;
  const customerName = window.prompt("Customer name?");
  if (!customerName) return;
  const weightKg = Number(window.prompt("Weight (kg)?", "1000") ?? 1000);
  const description = window.prompt("Description (optional)?") ?? undefined;

  await shipmentService.create({
    reference,
    customerName,
    weightKg,
    description,
    priority: "standard",
    status: "booked",
  });
  await reload();
}

async function handleDeleteShipment(id: string, reference: string, reload: () => Promise<void>) {
  if (!window.confirm(`Delete shipment ${reference}?`)) return;
  await shipmentService.remove(id);
  await reload();
}

async function handleStatusChange(id: string, status: ShipmentStatus, reload: () => Promise<void>) {
  await shipmentService.update(id, { status });
  await reload();
}
