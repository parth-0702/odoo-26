import { useMemo, useState } from "react";
import { useTrips, useDrivers, useVehicles } from "@/hooks/useResources";
import { tripService } from "@/services";
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
  const { data: drivers } = useDrivers();
  const { data: vehicles } = useVehicles();
  const { can } = useAuth();
  const [editing, setEditing] = useState<Trip | null>(null);
  const [creating, setCreating] = useState(false);

  const canCreate = can("trip", "create");
  const canUpdate = can("trip", "update");
  const canDelete = can("trip", "delete");

  const TRIP_FIELDS: FieldDef[] = useMemo(
    () => [
      { name: "reference", label: "Trip Reference", required: true, placeholder: "TRP-1005" },
      { name: "origin", label: "Origin", required: true },
      { name: "destination", label: "Destination", required: true },
      { name: "cargo", label: "Cargo" },
      { name: "distanceKm", label: "Distance (km)", type: "number" },
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
          { value: "queued", label: "Queued" },
          { value: "dispatched", label: "Dispatched" },
          { value: "in_transit", label: "In Transit" },
          { value: "delayed", label: "Delayed" },
          { value: "completed", label: "Completed" },
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
      { name: "etaMinutes", label: "ETA (minutes)", type: "number" },
    ],
    [vehicles, drivers]
  );

  const byStatus = useMemo(() => {
    const map: Record<string, Trip[]> = {};
    (data ?? []).forEach((t) => (map[t.status] ||= []).push(t));
    return map;
  }, [data]);

  const idOf = (ref?: Trip["vehicle"] | Trip["driver"]) =>
    typeof ref === "string" ? ref : ref?._id ?? "";

  const handleCreate = async (values: Record<string, string | number | undefined>) => {
    await tripService.create(values as Partial<Trip>);
    setCreating(false);
    reload();
  };

  const handleUpdate = async (values: Record<string, string | number | undefined>) => {
    if (!editing) return;
    await tripService.update(editing._id, values as Partial<Trip>);
    setEditing(null);
    reload();
  };

  const handleDelete = async (t: Trip) => {
    if (!confirm(`Delete trip "${t.reference}"? This cannot be undone.`)) return;
    await tripService.remove(t._id);
    reload();
  };

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Dispatch & Trips"
        subtitle="Live operations queue — routes & trips"
        actions={
          canCreate ? (
            <Button onClick={() => setCreating(true)}>
              <Icon name="add" className="text-[18px]" />
              New Trip
            </Button>
          ) : undefined
        }
      />

      {creating && (
        <Modal title="New Trip" onClose={() => setCreating(false)}>
          <ResourceForm
            fields={TRIP_FIELDS}
            initialValues={{ status: "queued", priority: "normal", distanceKm: 0 }}
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
            submitLabel="Create Trip"
          />
        </Modal>
      )}

      {editing && (
        <Modal title={`Edit ${editing.reference}`} onClose={() => setEditing(null)}>
          <ResourceForm
            fields={TRIP_FIELDS}
            initialValues={{
              reference: editing.reference,
              origin: editing.origin,
              destination: editing.destination,
              cargo: editing.cargo,
              distanceKm: editing.distanceKm,
              vehicle: idOf(editing.vehicle),
              driver: idOf(editing.driver),
              status: editing.status,
              priority: editing.priority,
              etaMinutes: editing.etaMinutes,
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
                    <Card key={t._id} className="p-3 group relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-body-md text-on-surface font-medium">{t.reference}</span>
                        <div className="flex items-center gap-1">
                          <Badge tone={priorityTone[t.priority]}>{t.priority}</Badge>
                          {canUpdate && (
                            <button
                              onClick={() => setEditing(t)}
                              className="text-on-surface-variant hover:text-primary p-0.5 rounded hover:bg-black/5"
                              title="Edit trip"
                            >
                              <Icon name="edit" className="text-[14px]" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(t)}
                              className="text-on-surface-variant hover:text-error p-0.5 rounded hover:bg-black/5"
                              title="Delete trip"
                            >
                              <Icon name="delete" className="text-[14px]" />
                            </button>
                          )}
                        </div>
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
                    <div className="text-center text-[12px] text-on-surface-variant/50 py-md border border-dashed border-black/10 rounded-lg">
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
