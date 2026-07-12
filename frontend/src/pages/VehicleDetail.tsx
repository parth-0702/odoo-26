import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useVehicle } from "@/hooks/useResources";
import { useDocuments, useMaintenance, useTrips, useFuelLogs } from "@/hooks/useResources";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { FullscreenLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { vehicleStatusTone, maintenanceStatusTone, docStatusTone, DOC_TYPE_LABELS } from "@/lib/status";
import { titleCase, formatCurrency, formatDate } from "@/lib/format";

const TABS = ["Overview", "Trips", "Maintenance", "Fuel", "Documents"] as const;
type Tab = (typeof TABS)[number];

function vehicleId(ref: unknown): string | undefined {
  if (!ref) return undefined;
  return typeof ref === "string" ? ref : (ref as { _id: string })._id;
}

export function VehicleDetail() {
  const { id = "" } = useParams();
  const { data: v, loading } = useVehicle(id);
  const [tab, setTab] = useState<Tab>("Overview");
  const trips = useTrips();
  const maintenance = useMaintenance();
  const fuel = useFuelLogs();
  const documents = useDocuments();

  if (loading) return <FullscreenLoader label="Loading vehicle telemetry…" />;
  if (!v) return <EmptyState icon="error" title="Vehicle not found" action={<Link to="/vehicles" className="text-primary">Back to registry</Link>} />;

  const vTrips = (trips.data ?? []).filter((t) => vehicleId(t.vehicle) === id);
  const vMaint = (maintenance.data ?? []).filter((m) => vehicleId(m.vehicle) === id);
  const vFuel = (fuel.data ?? []).filter((f) => vehicleId(f.vehicle) === id);
  const vDocs = (documents.data ?? []).filter((d) => vehicleId(d.vehicle) === id);

  return (
    <div className="animate-fade-in-up">
      <Link to="/vehicles" className="inline-flex items-center gap-1 text-body-md text-on-surface-variant hover:text-on-surface mb-md">
        <Icon name="arrow_back" className="text-[18px]" /> Registry
      </Link>
      <PageHeader
        title={v.registrationNumber}
        subtitle={`${v.make} ${v.model} · ${titleCase(v.type)}`}
        actions={<Badge tone={vehicleStatusTone[v.status]} pulse={v.status === "active"}>{titleCase(v.status)}</Badge>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-lg">
        <StatBox label="Health Score" value={`${v.healthScore}%`} icon="health_metrics" />
        <StatBox label="Fuel Level" value={`${v.fuelLevel}%`} icon="ev_station" />
        <StatBox label="Odometer" value={`${v.odometer.toLocaleString()} km`} icon="speed" />
        <StatBox label="Fuel Type" value={titleCase(v.fuelType)} icon="local_gas_station" />
      </div>

      <div className="flex gap-1 border-b border-black/[0.06] mb-md overflow-x-auto scrollbar-hide">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-body-md whitespace-nowrap border-b-2 transition-colors ${
              tab === t ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-md">
            <Info label="Location" value={v.location?.label ?? "Unknown"} />
            <Info label="Year" value={String(v.year ?? "—")} />
            <Info label="Type" value={titleCase(v.type)} />
            <Info label="Assigned Driver" value={typeof v.assignedDriver === "object" && v.assignedDriver ? v.assignedDriver.name : "Unassigned"} />
          </div>
        </Card>
      )}

      {tab === "Trips" && (
        <ListCard empty="No trips recorded" rows={vTrips.map((t) => ({
          key: t._id, title: t.reference, sub: `${t.origin} → ${t.destination}`, right: titleCase(t.status),
        }))} />
      )}

      {tab === "Maintenance" && (
        <div className="space-y-2">
          {vMaint.length === 0 && <EmptyState icon="build" title="No maintenance records" />}
          {vMaint.map((m) => (
            <Card key={m._id} className="flex items-center justify-between">
              <div>
                <div className="text-body-md text-on-surface">{m.title}</div>
                <div className="text-[12px] text-on-surface-variant">{formatDate(m.dueDate)} · {formatCurrency(m.cost)}</div>
              </div>
              <Badge tone={maintenanceStatusTone[m.status]}>{titleCase(m.status)}</Badge>
            </Card>
          ))}
        </div>
      )}

      {tab === "Fuel" && (
        <ListCard empty="No fuel logs" rows={vFuel.map((f) => ({
          key: f._id, title: `${f.liters} L`, sub: `${formatDate(f.date)} · ${f.station ?? ""}`, right: formatCurrency(f.totalCost),
        }))} />
      )}

      {tab === "Documents" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          {vDocs.length === 0 && <EmptyState icon="folder_open" title="No documents" />}
          {vDocs.map((d) => (
            <Card key={d._id} className="flex items-center justify-between">
              <div>
                <div className="text-body-md text-on-surface">{DOC_TYPE_LABELS[d.docType] ?? titleCase(d.docType)}</div>
                <div className="text-[12px] text-on-surface-variant">Exp: {formatDate(d.expiryDate)}</div>
              </div>
              <Badge tone={docStatusTone[d.status]}>{titleCase(d.status)}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <Card className="flex items-center gap-3">
      <Icon name={icon} className="text-[24px] text-primary" />
      <div>
        <div className="text-[11px] uppercase text-on-surface-variant">{label}</div>
        <div className="text-body-lg font-headline text-on-surface">{value}</div>
      </div>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase text-on-surface-variant">{label}</div>
      <div className="text-on-surface">{value}</div>
    </div>
  );
}

function ListCard({ rows, empty }: { rows: { key: string; title: string; sub: string; right: string }[]; empty: string }) {
  if (rows.length === 0) return <EmptyState icon="inbox" title={empty} />;
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <Card key={r.key} className="flex items-center justify-between">
          <div>
            <div className="text-body-md text-on-surface">{r.title}</div>
            <div className="text-[12px] text-on-surface-variant">{r.sub}</div>
          </div>
          <span className="text-data-tabular text-on-surface-variant">{r.right}</span>
        </Card>
      ))}
    </div>
  );
}