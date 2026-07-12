import { useMemo, useState } from "react";
import { useDrivers } from "@/hooks/useResources";
import { driverService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataState } from "@/components/ui/DataState";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { GaugeRing } from "@/components/ui/GaugeRing";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { ResourceForm, type FieldDef } from "@/components/ui/ResourceForm";
import { driverStatusTone } from "@/lib/status";
import { titleCase, initials, formatDate, daysUntil } from "@/lib/format";
import type { Driver, DriverStatus } from "@/types";
import clsx from "clsx";

const DRIVER_FIELDS: FieldDef[] = [
  { name: "name", label: "Full Name", required: true },
  { name: "employeeId", label: "Employee ID", required: true },
  { name: "licenseNumber", label: "License Number", required: true },
  { name: "licenseExpiry", label: "License Expiry", type: "date", required: true },
  { name: "phone", label: "Phone" },
  { name: "email", label: "Email" },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "on_duty", label: "On Duty" },
      { value: "resting", label: "Resting" },
      { value: "off_duty", label: "Off Duty" },
      { value: "at_risk", label: "At Risk" },
    ],
  },
  { name: "safetyScore", label: "Safety Score", type: "number" },
  { name: "hoursThisWeek", label: "Hours This Week", type: "number" },
];

const STATUS_FILTERS: { key: DriverStatus | "all"; label: string }[] = [
  { key: "all", label: "All Drivers" },
  { key: "on_duty", label: "On Duty" },
  { key: "resting", label: "Resting" },
  { key: "at_risk", label: "At Risk" },
  { key: "off_duty", label: "Off Duty" },
];

export function Drivers() {
  const { data, loading, error, reload } = useDrivers();
  const { can } = useAuth();
  const [filter, setFilter] = useState<DriverStatus | "all">("all");
  const [editing, setEditing] = useState<Driver | null>(null);
  const [creating, setCreating] = useState(false);

  const canCreate = can("driver", "create");
  const canUpdate = can("driver", "update");
  const canDelete = can("driver", "delete");

  const handleCreate = async (values: Record<string, string | number | undefined>) => {
    await driverService.create(values as Partial<Driver>);
    setCreating(false);
    reload();
  };

  const handleUpdate = async (values: Record<string, string | number | undefined>) => {
    if (!editing) return;
    await driverService.update(editing._id, values as Partial<Driver>);
    setEditing(null);
    reload();
  };

  const handleDelete = async (d: Driver) => {
    if (!confirm(`Delete driver "${d.name}"? This cannot be undone.`)) return;
    await driverService.remove(d._id);
    reload();
  };

  const counts = useMemo(() => {
    const rows = data ?? [];
    return {
      on_duty: rows.filter((d) => d.status === "on_duty").length,
      resting: rows.filter((d) => d.status === "resting").length,
      at_risk: rows.filter((d) => d.status === "at_risk").length,
      off_duty: rows.filter((d) => d.status === "off_duty").length,
    };
  }, [data]);

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Driver Fleet Management"
        subtitle="Monitor safety metrics, compliance & availability across your roster"
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
                  {f.key !== "all" && <span className="ml-1.5 opacity-70">{counts[f.key as DriverStatus]}</span>}
                </button>
              ))}
            </div>
            {canCreate && (
              <Button onClick={() => setCreating(true)}>
                <Icon name="add" className="text-[18px]" />
                Add Driver
              </Button>
            )}
          </div>
        }
      />

      {creating && (
        <Modal title="Add Driver" onClose={() => setCreating(false)}>
          <ResourceForm
            fields={DRIVER_FIELDS}
            initialValues={{ status: "off_duty", safetyScore: 80, hoursThisWeek: 0 }}
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
            submitLabel="Create Driver"
          />
        </Modal>
      )}

      {editing && (
        <Modal title={`Edit ${editing.name}`} onClose={() => setEditing(null)}>
          <ResourceForm
            fields={DRIVER_FIELDS}
            initialValues={{
              name: editing.name,
              employeeId: editing.employeeId,
              licenseNumber: editing.licenseNumber,
              licenseExpiry: editing.licenseExpiry?.slice(0, 10),
              phone: editing.phone,
              email: editing.email,
              status: editing.status,
              safetyScore: editing.safetyScore,
              hoursThisWeek: editing.hoursThisWeek,
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
        emptyIcon="badge"
        emptyTitle="No drivers found"
      >
        {(rows) => {
          const filtered = filter === "all" ? rows : rows.filter((d) => d.status === filter);
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
              {filtered.map((d) => {
                const licDays = daysUntil(d.licenseExpiry);
                return (
                  <Card key={d._id} className={clsx(d.status === "at_risk" && "border border-error/30")}>
                    <div className="flex items-start justify-between mb-md">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 shrink-0 rounded-full bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
                          {initials(d.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-body-lg font-headline text-on-surface truncate">{d.name}</div>
                          <div className="text-[12px] text-on-surface-variant">
                            {d.employeeId}
                            {d.yearsExperience !== undefined && <> · {d.yearsExperience} yrs</>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Badge tone={driverStatusTone[d.status]} pulse={d.status === "on_duty"}>{titleCase(d.status)}</Badge>
                        {canUpdate && (
                          <button
                            onClick={() => setEditing(d)}
                            className="text-on-surface-variant hover:text-primary p-1 rounded-lg hover:bg-black/5"
                            title="Edit driver"
                          >
                            <Icon name="edit" className="text-[16px]" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(d)}
                            className="text-on-surface-variant hover:text-error p-1 rounded-lg hover:bg-black/5"
                            title="Delete driver"
                          >
                            <Icon name="delete" className="text-[16px]" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-md">
                      <GaugeRing value={d.safetyScore} size={60} strokeWidth={5} label="Safety" />
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <InfoRow icon="badge" label="License exp" value={formatDate(d.licenseExpiry)} warn={licDays !== null && licDays < 60} />
                        <InfoRow icon="route" label="Current route" value={d.currentRoute ?? "—"} />
                        <InfoRow
                          icon="schedule"
                          label="Hours available"
                          value={d.hoursAvailable !== undefined ? `${d.hoursAvailable.toFixed(2)}h` : "—"}
                          warn={d.hoursAvailable !== undefined && d.hoursAvailable < 2}
                        />
                      </div>
                    </div>

                    {d.status === "at_risk" && d.recentViolation && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-error-container/15 border border-error/25 text-[12px] text-error mb-2">
                        <Icon name="warning" className="text-[16px]" filled />
                        Recent violation: {d.recentViolation}
                      </div>
                    )}

                    {d.complianceFlags && d.complianceFlags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2 border-t border-black/[0.06]">
                        {d.complianceFlags.map((f) => (
                          <Badge key={f} tone="danger">{titleCase(f)}</Badge>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
              {filtered.length === 0 && (
                <p className="col-span-full text-body-md text-on-surface-variant text-center py-lg">No drivers match this filter.</p>
              )}
            </div>
          );
        }}
      </DataState>
    </div>
  );
}

function InfoRow({ icon, label, value, warn }: { icon: string; label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="flex items-center gap-1.5 text-on-surface-variant">
        <Icon name={icon} className="text-[14px]" />
        {label}
      </span>
      <span className={clsx("font-medium truncate max-w-[130px] text-right", warn ? "text-warning" : "text-on-surface")}>{value}</span>
    </div>
  );
}
