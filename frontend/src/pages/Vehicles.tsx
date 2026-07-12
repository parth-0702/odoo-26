import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useVehicles } from "@/hooks/useResources";
import { vehicleService } from "@/services";
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
import { vehicleStatusTone } from "@/lib/status";
import { titleCase } from "@/lib/format";
import type { Vehicle, VehicleStatus } from "@/types";

const FILTERS: (VehicleStatus | "all")[] = ["all", "active", "idle", "in_maintenance", "flagged"];

const VEHICLE_FIELDS: FieldDef[] = [
  { name: "registrationNumber", label: "Registration No.", required: true },
  { name: "make", label: "Make", required: true },
  { name: "model", label: "Model", required: true },
  { name: "year", label: "Year", type: "number" },
  {
    name: "type",
    label: "Type",
    type: "select",
    required: true,
    options: ["truck", "van", "bus", "tanker", "trailer", "car"].map((v) => ({ value: v, label: titleCase(v) })),
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: ["active", "idle", "in_maintenance", "flagged", "retired"].map((v) => ({ value: v, label: titleCase(v) })),
  },
  {
    name: "fuelType",
    label: "Fuel Type",
    type: "select",
    options: ["diesel", "petrol", "electric", "cng"].map((v) => ({ value: v, label: titleCase(v) })),
  },
  { name: "odometer", label: "Odometer (km)", type: "number" },
  { name: "fuelLevel", label: "Fuel Level (%)", type: "number" },
  { name: "healthScore", label: "Health Score (%)", type: "number" },
];

export function Vehicles() {
  const { data, loading, error, reload } = useVehicles();
  const { can } = useAuth();
  const [filter, setFilter] = useState<VehicleStatus | "all">("all");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [creating, setCreating] = useState(false);

  const canCreate = can("vehicle", "create");
  const canUpdate = can("vehicle", "update");
  const canDelete = can("vehicle", "delete");

  const handleCreate = async (values: Record<string, string | number | undefined>) => {
    await vehicleService.create(values as Partial<Vehicle>);
    setCreating(false);
    reload();
  };

  const handleUpdate = async (values: Record<string, string | number | undefined>) => {
    if (!editing) return;
    await vehicleService.update(editing._id, values as Partial<Vehicle>);
    setEditing(null);
    reload();
  };

  const handleDelete = async (v: Vehicle) => {
    if (!confirm(`Delete vehicle "${v.registrationNumber}"? This cannot be undone.`)) return;
    await vehicleService.remove(v._id);
    reload();
  };

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
          canCreate ? (
            <Button onClick={() => setCreating(true)}>
              <Icon name="add" className="text-[18px]" />
              Add Vehicle
            </Button>
          ) : undefined
        }
      />

      {creating && (
        <Modal title="Add Vehicle" onClose={() => setCreating(false)}>
          <ResourceForm
            fields={VEHICLE_FIELDS}
            initialValues={{ status: "idle", type: "truck", fuelType: "diesel", fuelLevel: 100, healthScore: 100, odometer: 0 }}
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
            submitLabel="Create Vehicle"
          />
        </Modal>
      )}

      {editing && (
        <Modal title={`Edit ${editing.registrationNumber}`} onClose={() => setEditing(null)}>
          <ResourceForm
            fields={VEHICLE_FIELDS}
            initialValues={{
              registrationNumber: editing.registrationNumber,
              make: editing.make,
              model: editing.model,
              year: editing.year,
              type: editing.type,
              status: editing.status,
              fuelType: editing.fuelType,
              odometer: editing.odometer,
              fuelLevel: editing.fuelLevel,
              healthScore: editing.healthScore,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            submitLabel="Save Changes"
          />
        </Modal>
      )}

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
              <div key={v._id} className="relative group">
                <Link to={`/vehicles/${v._id}`}>
                  <Card className="hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between mb-md">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-surface-variant/40 flex items-center justify-center border border-black/[0.06]">
                          <Icon name="local_shipping" className="text-[22px] text-primary" />
                        </div>
                        <div>
                          <div className="text-body-lg font-headline text-on-surface">{v.registrationNumber}</div>
                          <div className="text-[12px] text-on-surface-variant">{v.make} {v.model}</div>
                        </div>
                      </div>
                      <Badge tone={vehicleStatusTone[v.status]} pulse={v.status === "active"}>
                        {titleCase(v.status)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <Metric label="Health" value={`${v.healthScore}%`} />
                      <Metric label="Fuel" value={`${v.fuelLevel}%`} />
                      <Metric label="Odo" value={`${Math.round(v.odometer / 1000)}k`} />
                    </div>
                  </Card>
                </Link>
                {(canUpdate || canDelete) && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container/90 rounded-lg p-0.5 border border-black/[0.06]">
                    {canUpdate && (
                      <button
                        onClick={(e) => { e.preventDefault(); setEditing(v); }}
                        className="text-on-surface-variant hover:text-primary p-1.5 rounded-lg hover:bg-black/5"
                        title="Edit vehicle"
                      >
                        <Icon name="edit" className="text-[16px]" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={(e) => { e.preventDefault(); handleDelete(v); }}
                        className="text-on-surface-variant hover:text-error p-1.5 rounded-lg hover:bg-black/5"
                        title="Delete vehicle"
                      >
                        <Icon name="delete" className="text-[16px]" />
                      </button>
                    )}
                  </div>
                )}
              </div>
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