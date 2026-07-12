import { useAuth } from "@/context/AuthContext";
import { useVehicles, useDrivers, useTrips, useMaintenance, useExpenses, useDocuments } from "@/hooks/useResources";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { MiniBarChart } from "@/components/ui/MiniBarChart";
import { Icon } from "@/components/ui/Icon";
import { ROLE_LABELS } from "@/config/permissions";
import { formatCurrency, daysUntil } from "@/lib/format";
import { vehicleStatusTone, tripStatusTone, driverStatusTone } from "@/lib/status";
import { titleCase } from "@/lib/format";
import { mockAssessments, mockFuelCostTrend, mockWorkOrderTrend } from "@/mocks";
import type { AssessmentVerdict } from "@/types";
import { Link } from "react-router-dom";

const VERDICT_TONE: Record<AssessmentVerdict, "success" | "warning" | "danger"> = {
  acceptable: "success",
  requires_review: "warning",
  unacceptable: "danger",
};

const VERDICT_LABEL: Record<AssessmentVerdict, string> = {
  acceptable: "Acceptable",
  requires_review: "Requires review",
  unacceptable: "Unacceptable",
};

export function Dashboard() {
  const { user, role } = useAuth();
  const vehicles = useVehicles();
  const drivers = useDrivers();
  const trips = useTrips();
  const maintenance = useMaintenance();
  const expenses = useExpenses();
  const documents = useDocuments();

  const loading = vehicles.loading || trips.loading;
  const vList = vehicles.data ?? [];
  const dList = drivers.data ?? [];
  const tList = trips.data ?? [];
  const mList = maintenance.data ?? [];
  const eList = expenses.data ?? [];
  const docList = documents.data ?? [];

  const activeVehicles = vList.filter((v) => v.status === "active").length;
  const activeTrips = tList.filter((t) => t.status === "in_transit" || t.status === "dispatched").length;
  const atRiskDrivers = dList.filter((d) => d.status === "at_risk").length;
  const overdueMaint = mList.filter((m) => m.status === "overdue" || m.status === "due").length;
  const monthlySpend = eList.reduce((s, e) => s + e.amount, 0);
  const expiringDocs = docList.filter((d) => d.status === "expiring_soon" || d.status === "expired").length;

  const kpisByRole: Record<string, { icon: string; label: string; value: string | number; tone: "primary" | "tertiary" | "secondary" | "error" | "neutral" }[]> = {
    fleet_manager: [
      { icon: "local_shipping", label: "Active Vehicles", value: `${activeVehicles}/${vList.length}`, tone: "primary" },
      { icon: "route", label: "Live Trips", value: activeTrips, tone: "secondary" },
      { icon: "build", label: "Service Alerts", value: overdueMaint, tone: "tertiary" },
      { icon: "payments", label: "Monthly Spend", value: formatCurrency(monthlySpend), tone: "neutral" },
    ],
    dispatcher: [
      { icon: "route", label: "Live Trips", value: activeTrips, tone: "primary" },
      { icon: "pending_actions", label: "Queued", value: tList.filter((t) => t.status === "queued").length, tone: "tertiary" },
      { icon: "warning", label: "Delayed", value: tList.filter((t) => t.status === "delayed").length, tone: "error" },
      { icon: "local_shipping", label: "Available Fleet", value: vList.filter((v) => v.status === "idle" || v.status === "active").length, tone: "secondary" },
    ],
    safety_officer: [
      { icon: "verified_user", label: "At-Risk Drivers", value: atRiskDrivers, tone: "error" },
      { icon: "badge", label: "On Duty", value: dList.filter((d) => d.status === "on_duty").length, tone: "secondary" },
      { icon: "description", label: "Expiring Docs", value: expiringDocs, tone: "tertiary" },
      { icon: "build", label: "Inspections Due", value: mList.filter((m) => m.type === "inspection").length, tone: "primary" },
    ],
    financial_analyst: [
      { icon: "payments", label: "Total Spend", value: formatCurrency(monthlySpend), tone: "primary" },
      { icon: "pending", label: "Pending Approvals", value: eList.filter((e) => e.status === "pending").length, tone: "tertiary" },
      { icon: "ev_station", label: "Fuel Costs", value: formatCurrency(eList.filter((e) => e.category === "fuel").reduce((s, e) => s + e.amount, 0)), tone: "secondary" },
      { icon: "build", label: "Maint. Costs", value: formatCurrency(mList.reduce((s, m) => s + m.cost, 0)), tone: "neutral" },
    ],
  };

  const kpis = role ? kpisByRole[role] : [];

  return (
    <div className="page-enter">
      <PageHeader
        title={`Welcome, ${user?.name?.split(" ")[0] ?? "Operator"}`}
        subtitle={`${role ? ROLE_LABELS[role] : ""} · Command Center Overview`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-md mb-lg">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : kpis.map((k, i) => <StatCard key={k.label} {...k} delay={i * 80} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Live trips */}
        <Card className="lg:col-span-2 stagger-item" style={{ animationDelay: "120ms" }}>
          <CardHeader
            title="Active Operations"
            action={<Link to="/trips" className="text-[12px] text-primary hover:underline">View all</Link>}
          />
          <div className="space-y-2">
            {tList.slice(0, 5).map((t) => (
              <div key={t._id} className="flex items-center justify-between p-3 rounded-lg bg-surface-variant/40 border border-black/[0.06] table-row-hover cursor-default">
                <div className="min-w-0">
                  <div className="text-body-md text-on-surface font-medium">{t.reference}</div>
                  <div className="text-[12px] text-on-surface-variant truncate">{t.origin} → {t.destination}</div>
                </div>
                <Badge tone={tripStatusTone[t.status]}>{titleCase(t.status)}</Badge>
              </div>
            ))}
            {tList.length === 0 && <p className="text-body-md text-on-surface-variant py-md text-center">No active trips.</p>}
          </div>
        </Card>

        {/* Right rail: role-flavored */}
        <Card className="stagger-item" style={{ animationDelay: "180ms" }}>
          <CardHeader title="Critical Status" />
          <div className="space-y-3">
            <StatusLine icon="local_shipping" label="Fleet health" value={`${activeVehicles} active`} tone={vehicleStatusTone.active} />
            <StatusLine icon="badge" label="Driver risk" value={`${atRiskDrivers} at risk`} tone={driverStatusTone.at_risk} />
            <StatusLine icon="build" label="Maintenance" value={`${overdueMaint} due`} tone="warning" />
            <StatusLine icon="description" label="Documents" value={`${expiringDocs} expiring`} tone="warning" />
            <div className="pt-2 mt-2 border-t border-black/[0.06]">
              <div className="text-label-caps uppercase text-on-surface-variant/60 mb-2">Docs expiring soon</div>
              {docList
                .filter((d) => (daysUntil(d.expiryDate) ?? 999) < 30)
                .slice(0, 3)
                .map((d) => (
                  <div key={d._id} className="flex justify-between text-[12px] py-1.5 px-2 rounded hover:bg-black/[0.03] transition-colors cursor-default">
                    <span className="text-on-surface-variant">{titleCase(d.docType)}</span>
                    <span className="text-warning">{daysUntil(d.expiryDate)}d</span>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Fleetio-style operations widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md mt-md">
        <Card className="stagger-item" style={{ animationDelay: "240ms" }}>
          <CardHeader title="Vehicle Status" />
          <div className="space-y-2">
            <StatusCount label="Active" value={vList.filter((v) => v.status === "active").length} tone="success" />
            <StatusCount label="Idle" value={vList.filter((v) => v.status === "idle").length} tone="neutral" />
            <StatusCount label="In Maintenance" value={vList.filter((v) => v.status === "in_maintenance").length} tone="warning" />
            <StatusCount label="Flagged" value={vList.filter((v) => v.status === "flagged").length} tone="danger" />
          </div>
        </Card>

        <Card className="stagger-item" style={{ animationDelay: "320ms" }}>
          <CardHeader title="Fuel Costs" action={<span className="text-[11px] text-on-surface-variant">Last 6 months</span>} />
          <MiniBarChart data={mockFuelCostTrend} color="#6ADB9E" formatValue={(v) => formatCurrency(v)} />
        </Card>

        <Card className="stagger-item" style={{ animationDelay: "400ms" }}>
          <CardHeader title="Work Orders" action={<span className="text-[11px] text-on-surface-variant">Last 6 months</span>} />
          <MiniBarChart data={mockWorkOrderTrend} color="#FFB693" />
        </Card>
      </div>

      <div className="mt-md">
        <Card>
          <CardHeader
            title="Smart Assessments"
            action={<span className="flex items-center gap-1 text-[11px] text-primary"><Icon name="auto_awesome" className="text-[16px]" filled />AI-reviewed</span>}
          />
          <div className="divide-y divide-black/[0.06]">
            {mockAssessments.map((a) => {
              const v = typeof a.vehicle === "object" ? a.vehicle : undefined;
              return (
                <div key={a._id} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-black/[0.02] transition-colors cursor-default">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-surface-variant/50 border border-black/[0.06] flex items-center justify-center">
                      <Icon name="local_shipping" className="text-[18px] text-on-surface-variant" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-on-surface-variant">{a.roNumber} · Vehicle #{v?.registrationNumber ?? "—"}</div>
                      <div className="text-body-md text-on-surface font-medium truncate">{a.title}</div>
                    </div>
                  </div>
                  <Badge tone={VERDICT_TONE[a.verdict]}>{VERDICT_LABEL[a.verdict]}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatusCount({ label, value, tone }: { label: string; value: number; tone: "success" | "neutral" | "warning" | "danger" }) {
  const dot: Record<string, string> = {
    success: "bg-success",
    neutral: "bg-outline",
    warning: "bg-warning",
    danger: "bg-error",
  };
  return (
    <div className="flex items-center justify-between text-body-md">
      <span className="flex items-center gap-2 text-on-surface-variant">
        <span className={`w-2 h-2 rounded-full ${dot[tone]}`} />
        {label}
      </span>
      <span className="font-headline font-bold text-on-surface">{value}</span>
    </div>
  );
}

function StatusLine({ icon, label, value, tone }: { icon: string; label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-body-md text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
        {label}
      </span>
      <Badge tone={tone as never}>{value}</Badge>
    </div>
  );
}