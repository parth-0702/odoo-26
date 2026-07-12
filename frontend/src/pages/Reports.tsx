import { useExpenses, useFuelLogs, useMaintenance, useTrips } from "@/hooks/useResources";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { formatCurrency, titleCase } from "@/lib/format";

export function Reports() {
  const expenses = useExpenses();
  const fuel = useFuelLogs();
  const maintenance = useMaintenance();
  const trips = useTrips();
  const loading = expenses.loading || fuel.loading;

  const eList = expenses.data ?? [];
  const total = eList.reduce((s, e) => s + e.amount, 0);
  const fuelCost = (fuel.data ?? []).reduce((s, f) => s + f.totalCost, 0);
  const maintCost = (maintenance.data ?? []).reduce((s, m) => s + m.cost, 0);
  const completedTrips = (trips.data ?? []).filter((t) => t.status === "completed").length;

  const byCategory = eList.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});
  const max = Math.max(1, ...Object.values(byCategory));

  return (
    <div className="animate-fade-in-up">
      <PageHeader title="Reports & Analytics" subtitle="Financial & operational performance" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-md mb-lg">
        {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
          <>
            <StatCard icon="payments" label="Total Spend" value={formatCurrency(total)} tone="primary" />
            <StatCard icon="ev_station" label="Fuel Cost" value={formatCurrency(fuelCost)} tone="secondary" />
            <StatCard icon="build" label="Maintenance" value={formatCurrency(maintCost)} tone="tertiary" />
            <StatCard icon="check_circle" label="Trips Completed" value={completedTrips} tone="neutral" />
          </>
        )}
      </div>
      <Card>
        <CardHeader title="Spend by Category" />
        <div className="space-y-3">
          {Object.entries(byCategory).map(([cat, amt]) => (
            <div key={cat}>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-on-surface-variant">{titleCase(cat)}</span>
                <span className="text-on-surface">{formatCurrency(amt)}</span>
              </div>
              <div className="h-2 rounded-full bg-surface-variant/30 overflow-hidden">
                <div className="h-full rounded-full bg-primary-container" style={{ width: `${(amt / max) * 100}%` }} />
              </div>
            </div>
          ))}
          {Object.keys(byCategory).length === 0 && !loading && (
            <p className="text-body-md text-on-surface-variant text-center py-md">No expense data.</p>
          )}
        </div>
      </Card>
    </div>
  );
}