import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { useDrivers, useMaintenance, useVehicles } from "@/hooks/useResources";

export function AIInsights() {
  const vehicles = useVehicles();
  const drivers = useDrivers();
  const maintenance = useMaintenance();

  const insights = [
    {
      icon: "trending_down", tone: "warning" as const, title: "Predictive maintenance",
      body: `${(maintenance.data ?? []).filter((m) => m.type === "predictive" || m.status === "due").length} vehicles show early wear signals. Schedule service to avoid downtime.`,
    },
    {
      icon: "warning", tone: "danger" as const, title: "Driver risk detection",
      body: `${(drivers.data ?? []).filter((d) => d.status === "at_risk").length} drivers flagged for fatigue/compliance. Recommend rest reassignment.`,
    },
    {
      icon: "eco", tone: "success" as const, title: "Fuel optimization",
      body: `Route consolidation could cut fuel spend ~12% across ${(vehicles.data ?? []).length} active assets.`,
    },
    {
      icon: "insights", tone: "primary" as const, title: "Utilization forecast",
      body: "Fleet utilization trending up 8% week-over-week. Consider capacity for peak demand.",
    },
  ];

  return (
    <div className="animate-fade-in-up">
      <PageHeader title="AI Insights Hub" subtitle="Predictive analytics & recommendations" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {insights.map((i) => (
          <Card key={i.title}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-container/15 border border-primary/20 flex items-center justify-center shrink-0">
                <Icon name={i.icon} className="text-[20px] text-primary" filled />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-body-lg font-headline text-on-surface">{i.title}</span>
                  <Badge tone={i.tone}>AI</Badge>
                </div>
                <p className="text-body-md text-on-surface-variant">{i.body}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}