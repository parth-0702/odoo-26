import { useMemo, useState } from "react";
import { useShipments, useDrivers, useVehicles, useTrips } from "@/hooks/useResources";
import { shipmentService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { DataState } from "@/components/ui/DataState";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { ResourceForm, type FieldDef } from "@/components/ui/ResourceForm";
import { formatDate, titleCase } from "@/lib/format";
import type { Shipment, ShipmentStatus } from "@/types";
import clsx from "clsx";

const shipmentStatusTone: Record<ShipmentStatus, "neutral" | "info" | "success" | "warning" | "danger"> = {
  pending: "neutral",
  picked_up: "info",
  in_transit: "info",
  out_for_delivery: "warning",
  delivered: "success",
  cancelled: "danger",
};

const priorityTone: Record<Shipment["priority"], "neutral" | "info" | "warning" | "danger"> = {
  low: "neutral", normal: "info", high: "warning", urgent: "danger",
};

const STATUS_FILTERS: { key: ShipmentStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "picked_up", label: "Picked Up" },
  { key: "in_transit", label: "In Transit" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export function Shipments() {
  const { data, loading, error, reload } = useShipments();
  const { data: drivers } = useDrivers();
  const { data: vehicles } = useVehicles();
  const { data: trips } = useTrips();
  const { can } = useAuth();
  const [filter, setFilter] = useState<ShipmentStatus | "all">("all");
  const [editing, setEditing] = useState<Shipment | null>(null);
  const [creating, setCreating] = useState(false);

  const canCreate = can("shipment", "create");
  const canUpdate = can("shipment", "update");
  const canDelete = can("shipment", "delete");

  const SHIPMENT_FIELDS: FieldDef[] = useMemo(
    () => [
      { name: "reference", label: "Shipment Ref", required: true, placeholder: "SHP-5005" },
      { name: "customerName", label: "Customer", required: true },
      { name: "origin", label: "Origin", required: true },
      { name: "destination", label: "Destination", required: true },
      { name: "contents", label: "Contents" },
      { name: "weightKg", label: "Weight (kg)", type: "number" },
      {
        name: "trip",
        label: "Linked Trip",
        type: "select",
        options: (trips ?? []).map((t) => ({ value: t._id, label: t.reference })),
      },
      {
        name: "vehicle",
        label: "Vehicle",
        type: "select",
        options: (vehicles ?? []).map((v) => ({ value: v._id, label: v.registrationNumber })),
      },
      {
        name: "driver",
        label: "Driver",
        type: "select",
        options: (drivers ?? []).map((d) => ({ value: d._id, label: d.name })),
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { value: "pending", label: "Pending" },
          { value: "picked_up", label: "Picked Up" },
          { value: "in_transit", label: "In Transit" },
          { value: "out_for_delivery", label: "Out for Delivery" },
          { value: "delivered", label: "Delivered" },
          { value: "cancelled", label: "Cancelled" },
        ],
      },
      {
        name: "priority",
        label: "Priority",
        type: "select",
        options: [
          { value: "low", label: "Low" },
          { value: "normal", label: "Normal" },
          { value: "high", label: "High" },
          { value: "urgent", label: "Urgent" },
        ],
      },
      { name: "expectedDelivery", label: "Expected Delivery", type: "date" },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
    [trips, vehicles, drivers]
  );

  const idOf = (ref?: Shipment["vehicle"] | Shipment["driver"] | Shipment["trip"]) =>
    typeof ref === "string" ? ref : ref?._id ?? "";

  const nameOf = (ref?: Shipment["vehicle"] | Shipment["driver"], fallback = "—") => {
    if (!ref) return fallback;
    if (typeof ref === "string") return ref;
    return "registrationNumber" in ref ? ref.registrationNumber : ref.name;
  };

  const filtered = useMemo(
    () => (data ?? []).filter((s) => filter === "all" || s.status === filter),
    [data, filter]
  );

  const handleCreate = async (values: Record<string, string | number | undefined>) => {
    await shipmentService.create(values as Partial<Shipment>);
    setCreating(false);
    reload();
  };

  const handleUpdate = async (values: Record<string, string | number | undefined>) => {
    if (!editing) return;
    await shipmentService.update(editing._id, values as Partial<Shipment>);
    setEditing(null);
    reload();
  };

  const handleDelete = async (s: Shipment) => {
    if (!confirm(`Delete shipment "${s.reference}"? This cannot be undone.`)) return;
    await shipmentService.remove(s._id);
    reload();
  };

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Shipments"
        subtitle="Track customer shipments end-to-end"
        actions={
          <div className="flex flex-wrap items-center gap-sm">
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={clsx(
                    "px-3 py-1.5 rounded-full text-[12px] border transition-colors",
                    filter === f.key
                      ? "bg-primary-container/25 border-primary/40 text-primary"
                      : "bg-black/[0.03] border-black/10 text-on-surface-variant hover:text-on-surface"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {canCreate && (
              <Button onClick={() => setCreating(true)}>
                <Icon name="add" className="text-[18px]" />
                New Shipment
              </Button>
            )}
          </div>
        }
      />

      {creating && (
        <Modal title="New Shipment" onClose={() => setCreating(false)} wide>
          <ResourceForm
            fields={SHIPMENT_FIELDS}
            initialValues={{ status: "pending", priority: "normal", weightKg: 0 }}
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
            submitLabel="Create Shipment"
          />
        </Modal>
      )}

      {editing && (
        <Modal title={`Edit ${editing.reference}`} onClose={() => setEditing(null)} wide>
          <ResourceForm
            fields={SHIPMENT_FIELDS}
            initialValues={{
              reference: editing.reference,
              customerName: editing.customerName,
              origin: editing.origin,
              destination: editing.destination,
              contents: editing.contents,
              weightKg: editing.weightKg,
              trip: idOf(editing.trip),
              vehicle: idOf(editing.vehicle),
              driver: idOf(editing.driver),
              status: editing.status,
              priority: editing.priority,
              expectedDelivery: editing.expectedDelivery?.slice(0, 10),
              notes: editing.notes,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            submitLabel="Save Changes"
          />
        </Modal>
      )}

      <DataState
        loading={loading}
        error={error}
        data={filtered}
        onRetry={reload}
        skeleton={<SkeletonRows rows={6} />}
        emptyIcon="local_shipping"
        emptyTitle="No shipments found"
      >
        {(rows) => (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
            {rows.map((s) => (
              <Card key={s._id} className="relative">
                <div className="flex items-start justify-between mb-md">
                  <div>
                    <div className="text-body-lg font-headline text-on-surface">{s.reference}</div>
                    <div className="text-[12px] text-on-surface-variant">{s.customerName}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge tone={priorityTone[s.priority]}>{s.priority}</Badge>
                    <Badge tone={shipmentStatusTone[s.status]}>{titleCase(s.status)}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[12px] text-on-surface-variant mb-2">
                  <Icon name="trip_origin" className="text-[14px]" />
                  <span className="truncate">{s.origin}</span>
                  <Icon name="arrow_right_alt" className="text-[14px]" />
                  <span className="truncate">{s.destination}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[12px] text-on-surface-variant mb-md">
                  <span className="flex items-center gap-1"><Icon name="inventory_2" className="text-[14px]" />{s.contents || "—"}{s.weightKg ? ` · ${s.weightKg}kg` : ""}</span>
                  <span className="flex items-center gap-1"><Icon name="badge" className="text-[14px]" />{nameOf(s.driver)}</span>
                  <span className="flex items-center gap-1"><Icon name="local_shipping" className="text-[14px]" />{nameOf(s.vehicle)}</span>
                  <span className="flex items-center gap-1"><Icon name="event" className="text-[14px]" />{s.expectedDelivery ? formatDate(s.expectedDelivery) : "—"}</span>
                </div>

                {(canUpdate || canDelete) && (
                  <div className="flex items-center justify-end gap-1 pt-2 border-t border-black/[0.06]">
                    {canUpdate && (
                      <button
                        onClick={() => setEditing(s)}
                        className="text-on-surface-variant hover:text-primary p-1.5 rounded-lg hover:bg-black/5"
                        title="Edit shipment"
                      >
                        <Icon name="edit" className="text-[16px]" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(s)}
                        className="text-on-surface-variant hover:text-error p-1.5 rounded-lg hover:bg-black/5"
                        title="Delete shipment"
                      >
                        <Icon name="delete" className="text-[16px]" />
                      </button>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </DataState>
    </div>
  );
}
