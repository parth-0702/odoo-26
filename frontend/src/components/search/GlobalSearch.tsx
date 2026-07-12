import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { titleCase } from "@/lib/format";
import { DOC_TYPE_LABELS } from "@/lib/status";

interface Row {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  group: string;
  to: string;
}

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const { results, loading, count } = useGlobalSearch(query);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const rows = useMemo<Row[]>(() => {
    const r: Row[] = [];
    results.vehicles.forEach((v) =>
      r.push({ id: v._id, icon: "local_shipping", title: v.registrationNumber, subtitle: `${v.make} ${v.model}`, group: "Vehicles", to: `/vehicles/${v._id}` })
    );
    results.drivers.forEach((d) =>
      r.push({ id: d._id, icon: "badge", title: d.name, subtitle: d.employeeId, group: "Drivers", to: `/drivers` })
    );
    results.trips.forEach((t) =>
      r.push({ id: t._id, icon: "route", title: t.reference, subtitle: `${t.origin} → ${t.destination}`, group: "Trips", to: `/trips` })
    );
    results.documents.forEach((d) =>
      r.push({ id: d._id, icon: "description", title: DOC_TYPE_LABELS[d.docType] ?? titleCase(d.docType), subtitle: d.documentNumber ?? "", group: "Documents", to: `/documents` })
    );
    return r;
  }, [results]);

  useEffect(() => setActive(0), [count]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, rows.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      else if (e.key === "Enter" && rows[active]) { navigate(rows[active].to); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, rows, active, navigate, onClose]);

  if (!open) return null;

  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl glass-panel rounded-2xl overflow-hidden border border-black/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-lg h-16 border-b border-black/[0.06]">
          <Icon name="search" className="text-[22px] text-on-surface-variant" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vehicles, drivers, trips, documents…"
            className="flex-1 bg-transparent outline-none text-body-lg text-on-surface placeholder:text-on-surface-variant/60"
          />
          {loading && <Spinner />}
          <kbd className="text-[10px] px-2 py-1 rounded bg-surface-variant/50 text-on-surface-variant border border-black/10">
            ESC
          </kbd>
        </div>

        <div className="max-h-[52vh] overflow-y-auto scrollbar-hide py-2">
          {query && !loading && rows.length === 0 && (
            <div className="px-lg py-xl text-center text-body-md text-on-surface-variant">
              No results for “{query}”
            </div>
          )}
          {!query && (
            <div className="px-lg py-xl text-center text-body-md text-on-surface-variant">
              Start typing to search across the fleet.
            </div>
          )}
          {rows.map((row, i) => {
            const showGroup = row.group !== lastGroup;
            lastGroup = row.group;
            return (
              <div key={row.id}>
                {showGroup && (
                  <div className="px-lg pt-3 pb-1 text-label-caps uppercase text-on-surface-variant/60">
                    {row.group}
                  </div>
                )}
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => { navigate(row.to); onClose(); }}
                  className={`w-full flex items-center gap-3 px-lg py-2.5 text-left transition-colors ${
                    i === active ? "bg-primary/10" : "hover:bg-black/[0.03]"
                  }`}
                >
                  <Icon name={row.icon} className="text-[20px] text-primary" />
                  <div className="min-w-0">
                    <div className="text-body-md text-on-surface truncate">{row.title}</div>
                    <div className="text-[12px] text-on-surface-variant truncate">{row.subtitle}</div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}