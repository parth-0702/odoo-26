import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useExpenses, useVehicles, useTrips
} from "@/hooks/useResources";
import { usePermissions } from "@/hooks/usePermissions";
import { expenseService } from "@/services";
import {
  CreditCard, Search, Plus,
  CheckCircle, XCircle, AlertTriangle, ShieldCheck,
  User, Truck, Receipt
} from "lucide-react";
import { titleCase, formatCurrency, formatDate } from "@/lib/format";
import { Modal } from "@/components/ui/Modal";
import { ResourceForm, type FieldDef } from "@/components/ui/ResourceForm";
import type { Expense, ExpenseStatus } from "@/types";

const STATUS_CONFIG: Record<ExpenseStatus, { color: string; bg: string; label: string; icon: any }> = {
  approved: { color: "#22C55E", bg: "bg-success-dim",  label: "Approved", icon: CheckCircle },
  pending:  { color: "#F59E0B", bg: "bg-warning-dim",  label: "Pending",  icon: AlertTriangle },
  rejected: { color: "#EF4444", bg: "bg-danger-dim",   label: "Rejected", icon: XCircle },
};

export function Expenses() {
  const { data, loading, reload } = useExpenses();
  const { can } = usePermissions();
  const vehicles = useVehicles();
  const trips = useTrips();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ExpenseStatus | "all">("all");
  const [creating, setCreating] = useState(false);

  const items = data ?? [];

  const filtered = useMemo(() => {
    return items.filter(e => {
      const matchStatus = filter === "all" || e.status === filter;
      const matchQuery = !query.trim() ||
        e.description.toLowerCase().includes(query.toLowerCase()) ||
        e.category.toLowerCase().includes(query.toLowerCase()) ||
        (typeof e.recordedBy === "object" && e.recordedBy?.name.toLowerCase().includes(query.toLowerCase()));
      return matchStatus && matchQuery;
    });
  }, [items, filter, query]);

  const stats = useMemo(() => {
    return {
      all:      items.length,
      approved: items.filter(e => e.status === "approved").length,
      pending:  items.filter(e => e.status === "pending").length,
      rejected: items.filter(e => e.status === "rejected").length,
      totalVal: items.filter(e => e.status === "approved").reduce((sum, e) => sum + e.amount, 0),
    };
  }, [items]);

  const handleCreate = async (values: Record<string, string | number | undefined>) => {
    await expenseService.create({
      ...values,
      status: "pending",
      date: new Date().toISOString(),
    } as Partial<Expense>);
    setCreating(false);
    reload();
  };

  const handleApprove = async (id: string) => {
    await expenseService.update(id, { status: "approved" });
    reload();
  };

  const handleReject = async (id: string) => {
    await expenseService.update(id, { status: "rejected" });
    reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    await expenseService.remove(id);
    reload();
  };

  const formFields: FieldDef[] = [
    { name: "description", label: "Description / Purpose", required: true, placeholder: "e.g., Highway toll tax payment" },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: [
        { value: "fuel", label: "Fuel" },
        { value: "maintenance", label: "Maintenance" },
        { value: "tolls", label: "Tolls" },
        { value: "permits", label: "Permits" },
        { value: "insurance", label: "Insurance" },
        { value: "other", label: "Other" },
      ],
    },
    { name: "amount", label: "Amount (₹)", type: "number", required: true },
    {
      name: "vehicle",
      label: "Associated Vehicle",
      type: "select",
      options: (vehicles.data ?? []).map(v => ({ value: v._id, label: v.registrationNumber })),
    },
    {
      name: "trip",
      label: "Associated Trip",
      type: "select",
      options: (trips.data ?? []).map(t => ({ value: t._id, label: t.reference })),
    },
  ];

  return (
    <div className="page-enter space-y-5 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-headline-md font-headline font-bold text-on-surface">Expense Roster</h1>
          <p className="text-on-surface-variant text-body-md mt-0.5">Track and approve operational fleet costs</p>
        </div>
        {can("expense", "create") && (
          <button onClick={() => setCreating(true)} className="btn-primary">
            <Plus size={15} /> Log Expense
          </button>
        )}
      </div>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Approved Expenses", value: formatCurrency(stats.totalVal), color: "#22C55E", icon: ShieldCheck },
          { label: "Pending Approvals", value: stats.pending, color: "#F59E0B", icon: AlertTriangle, isCount: true },
          { label: "Rejected Claims", value: stats.rejected, color: "#EF4444", icon: XCircle, isCount: true },
          { label: "Total Logged Claims", value: stats.all, color: "#3B82F6", icon: Receipt, isCount: true },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="fleet-card p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}12` }}>
                <Icon size={16} style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-[10px] uppercase text-on-surface-muted font-medium">{s.label}</div>
                <div className="text-body-lg font-headline font-bold text-on-surface mt-0.5">{s.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="fleet-card p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-muted" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search expenses…"
              className="fleet-input pl-9 h-9 text-[12px] w-full"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: "all",      label: "All Claims" },
              { key: "approved", label: "Approved" },
              { key: "pending",  label: "Pending" },
              { key: "rejected", label: "Rejected" },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as any)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] border transition-all ${
                  filter === f.key
                    ? "bg-primary-container border-primary/50 text-primary"
                    : "border-border text-on-surface-muted hover:border-border-strong hover:text-on-surface"
                }`}
              >
                {f.key !== "all" && STATUS_CONFIG[f.key as ExpenseStatus] && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_CONFIG[f.key as ExpenseStatus].color }} />
                )}
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-20 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="fleet-card flex flex-col items-center py-16 text-on-surface-muted">
          <CreditCard size={40} className="mb-3 opacity-25" />
          <p className="font-medium text-on-surface">No expenses found</p>
          <p className="text-body-md mt-1">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((e, idx) => {
            const statusCfg = STATUS_CONFIG[e.status] ?? STATUS_CONFIG.pending;
            const StatusIcon = statusCfg.icon;
            const recorder = typeof e.recordedBy === "object" && e.recordedBy ? e.recordedBy.name : "Driver / Operator";
            const vehicleReg = typeof e.vehicle === "object" && e.vehicle ? e.vehicle.registrationNumber : null;

            return (
              <motion.div
                key={e._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="fleet-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center flex-shrink-0">
                    <CreditCard size={18} className="text-primary" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-headline font-semibold text-on-surface text-body-lg truncate">
                        {e.description}
                      </h3>
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{
                          background: `${statusCfg.color}15`,
                          color: statusCfg.color,
                        }}
                      >
                        {titleCase(e.category)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-md text-on-surface-variant mt-1.5">
                      <span className="flex items-center gap-1">
                        <User size={12} className="opacity-60" /> Filed by: {recorder}
                      </span>
                      {vehicleReg && (
                        <span className="flex items-center gap-1">
                          <Truck size={12} className="opacity-60" /> Vehicle: {vehicleReg}
                        </span>
                      )}
                      <span>· Filed: {formatDate(e.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-body-lg font-headline font-bold text-on-surface tabular-nums">
                      {formatCurrency(e.amount, e.currency)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1.5"
                      style={{
                        background: `${statusCfg.color}12`,
                        color: statusCfg.color,
                        borderColor: `${statusCfg.color}30`
                      }}
                    >
                      <StatusIcon size={12} />
                      {statusCfg.label}
                    </span>

                    {/* Manage actions (fleet_manager or admin) */}
                    {e.status === "pending" && can("expense", "update") && (
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => handleApprove(e._id)}
                          className="h-8 px-2.5 rounded-lg font-medium text-[11px] border border-success/30 bg-success/10 text-success hover:bg-success/20 transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(e._id)}
                          className="h-8 px-2.5 rounded-lg font-medium text-[11px] border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20 transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {can("expense", "delete") && (
                      <button
                        onClick={() => handleDelete(e._id)}
                        className="h-8 px-2 rounded-lg font-medium text-[11px] border border-border text-on-surface-muted hover:text-danger hover:border-danger/30 transition-all ml-1"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Creation Modal */}
      <AnimatePresence>
        {creating && (
          <Modal title="Log Operational Claim" onClose={() => setCreating(false)}>
            <ResourceForm
              fields={formFields}
              initialValues={{ category: "other", amount: 100 }}
              onSubmit={handleCreate}
              onCancel={() => setCreating(false)}
              submitLabel="Submit Claim"
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}