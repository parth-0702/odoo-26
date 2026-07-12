import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useVehicles } from "@/hooks/useResources";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { vehicleStatusTone } from "@/lib/status";
import { titleCase } from "@/lib/format";
import type { Vehicle, VehicleStatus } from "@/types";
import clsx from "clsx";

const PIN_COLOR: Record<VehicleStatus, string> = {
  active: "#1E8E5A",
  idle: "#8A8D93",
  in_maintenance: "#C77700",
  flagged: "#D32F2F",
  retired: "#C7C9CE",
};

const FILTERS: { key: VehicleStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "idle", label: "Idle" },
  { key: "in_maintenance", label: "Maintenance" },
  { key: "flagged", label: "Flagged" },
];

export function LiveMap() {
  const { data, loading } = useVehicles();
  const all = data ?? [];
  const [filter, setFilter] = useState<VehicleStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Vehicle | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  const withCoords = useMemo(
    () => all.filter((v) => v.location?.lat !== undefined && v.location?.lng !== undefined),
    [all]
  );

  const filtered = useMemo(() => {
    return withCoords.filter((v) => {
      const matchesFilter = filter === "all" || v.status === filter;
      const matchesQuery =
        query.trim() === "" ||
        v.registrationNumber.toLowerCase().includes(query.toLowerCase()) ||
        v.location?.label?.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [withCoords, filter, query]);

  const counts = {
    active: withCoords.filter((v) => v.status === "active").length,
    idle: withCoords.filter((v) => v.status === "idle").length,
    in_maintenance: withCoords.filter((v) => v.status === "in_maintenance").length,
    flagged: withCoords.filter((v) => v.status === "flagged").length,
    retired: withCoords.filter((v) => v.status === "retired").length,
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center on India
    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    filtered.forEach((v, idx) => {
      if (!v.location?.lat || !v.location?.lng) return;

      const isSelected = selected?._id === v._id;
      const color = PIN_COLOR[v.status];
      const pulseHtml = v.status === "active" ? `<div class="marker-pulse-ring" style="color: ${color}"></div>` : "";

      const iconHtml = `
        <div class="relative w-8 h-8 group" style="animation: marker-pop 0.5s cubic-bezier(0.22,1,0.36,1) ${idx * 0.05}s both;">
          <div class="w-full h-full rounded-full rounded-br-none rotate-45 border-2 border-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
               style="background: ${color}; ${isSelected ? "transform: scale(1.15); box-shadow: 0 0 0 2px rgba(255,255,255,0.8), 0 0 15px rgba(0,0,0,0.3);" : ""}">
            <span class="material-symbols-outlined text-[15px] -rotate-45 text-white" style="font-size: 14px;">local_shipping</span>
          </div>
          ${pulseHtml}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "bg-transparent border-none",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([v.location.lat, v.location.lng], { icon: customIcon }).addTo(map);
      
      marker.on("click", () => {
        setSelected(v);
        map.setView([v.location!.lat!, v.location!.lng!], 14, { animate: true, duration: 1 });
      });

      markersRef.current[v._id] = marker;
    });
  }, [filtered, selected]);

  // Handle selected vehicle centering
  useEffect(() => {
    const map = mapRef.current;
    if (map && selected?.location?.lat && selected?.location?.lng) {
      map.setView([selected.location.lat, selected.location.lng], 14, { animate: true, duration: 1 });
    }
  }, [selected]);

  return (
    <div className="page-enter h-[calc(100vh-8rem)] relative rounded-[1.5rem] overflow-hidden border-[3px] border-outline shadow-pop-lg">
      {/* The Leaflet Map Container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-[#e8ecf0]" />

      {/* Selected vehicle popover overlay */}
      {selected && (
        <div className="absolute bottom-4 left-4 sm:left-auto sm:right-4 z-[400] w-[280px]">
          <Card className="!p-md relative shadow-pop-lg border-2 border-outline">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-on-surface-variant hover:text-on-surface bg-black/5 rounded-full p-1"
            >
              <Icon name="close" className="text-[16px]" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ background: PIN_COLOR[selected.status] }}>
                 <Icon name="local_shipping" className="text-[16px]" filled />
              </div>
              <div>
                <span className="block text-body-md font-headline font-bold text-on-surface leading-tight">{selected.registrationNumber}</span>
                <span className="block text-[11px] text-on-surface-variant">{selected.make} {selected.model}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-3 my-3 p-3 bg-surface-variant/30 rounded-xl border border-black/[0.03]">
              <div>
                <div className="text-on-surface-variant/70 uppercase text-[9px] font-bold tracking-wide">Driver</div>
                <div className="text-[12px] text-on-surface font-medium truncate">
                  {typeof selected.assignedDriver === 'object' ? selected.assignedDriver?.name || "Unassigned" : "Assigned"}
                </div>
              </div>
              <div>
                <div className="text-on-surface-variant/70 uppercase text-[9px] font-bold tracking-wide">Status</div>
                <Badge tone={vehicleStatusTone[selected.status]}>{titleCase(selected.status)}</Badge>
              </div>
              <div>
                <div className="text-on-surface-variant/70 uppercase text-[9px] font-bold tracking-wide">Speed</div>
                <div className="text-[13px] text-on-surface font-data-tabular font-semibold">{selected.speedKmph ?? 0} <span className="text-[10px] font-normal text-on-surface-variant">km/h</span></div>
              </div>
              <div>
                <div className="text-on-surface-variant/70 uppercase text-[9px] font-bold tracking-wide">Fuel</div>
                <div className="text-[13px] text-on-surface font-data-tabular font-semibold">{selected.fuelLevel}<span className="text-[10px] font-normal text-on-surface-variant">%</span></div>
              </div>
            </div>
            <div className="text-[11px] text-on-surface-variant flex items-center gap-1.5 mb-3 bg-surface/80 border-2 border-outline/20 p-2 rounded-lg font-medium">
              <Icon name="location_on" className="text-[14px] text-primary" />
              <span className="truncate">{selected.location?.label ?? "Unknown location"}</span>
            </div>
            <button className="w-full py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-[12px] font-semibold transition-colors duration-200" onClick={() => window.location.href = `/vehicles/${selected._id}`}>
              View Full Details
            </button>
          </Card>
        </div>
      )}

      {/* Left panel: search + list */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-[340px] max-h-[calc(100%-2rem)] flex flex-col z-[400] pointer-events-none">
        <Card className="!p-md mb-3 shrink-0 pointer-events-auto shadow-pop border-2 border-outline bg-surface/95">
          <div className="flex items-center justify-between mb-md">
            <h3 className="text-body-lg font-headline font-bold text-on-surface">Live GPS Tracking</h3>
            <Badge tone="primary" pulse>{counts.active} live</Badge>
          </div>
          <div className="relative mb-3">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reg. no. or location…"
              className="w-full bg-black/[0.03] border border-black/10 rounded-xl pl-9 pr-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={clsx(
                  "px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all duration-200",
                  filter === f.key
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                    : "bg-surface border-black/10 text-on-surface-variant hover:border-primary/40 hover:text-primary"
                )}
              >
                {f.label}
                {f.key !== "all" && <span className={clsx("ml-1.5 px-1.5 py-0.5 rounded-full text-[9px]", filter === f.key ? "bg-white/25 text-white" : "bg-black/5 text-on-surface-variant")}>{counts[f.key as VehicleStatus]}</span>}
              </button>
            ))}
          </div>
        </Card>

        <Card className="!p-0 flex-1 overflow-hidden flex flex-col pointer-events-auto shadow-pop border-2 border-outline bg-surface/95">
          <div className="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-1">
            {loading ? (
              <div className="flex justify-center py-xl"><span className="w-8 h-8 rounded-full border-2 border-black/10 border-t-primary animate-spin" /></div>
            ) : (
              <>
                {filtered.map((v) => (
                  <button
                    key={v._id}
                    onClick={() => setSelected(v)}
                    className={clsx(
                      "w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-200 motion-safe-ui group hover:bg-black/[0.02]",
                      selected?._id === v._id ? "bg-primary/5 border border-primary/20 shadow-sm" : "border border-transparent"
                    )}
                  >
                    <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: PIN_COLOR[v.status] }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-body-md font-bold text-on-surface">{v.registrationNumber}</span>
                        <span className="text-[10px] font-semibold text-on-surface-variant bg-black/5 px-1.5 rounded">{v.speedKmph || 0} km/h</span>
                      </div>
                      <div className="text-[11px] text-on-surface-variant truncate flex items-center gap-1">
                        <span className="truncate">{v.location?.label ?? "In transit"}</span>
                      </div>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                    <Icon name="search_off" className="text-[32px] text-on-surface-variant/30 mb-2" />
                    <p className="text-[13px] text-on-surface-variant font-medium">No vehicles match filters.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Legend */}
      <div className="hidden sm:flex absolute top-4 right-4 z-[400] gap-4 bg-surface/95 backdrop-blur-md border-2 border-outline rounded-xl px-4 py-2.5 shadow-pop-sm">
        {(Object.keys(PIN_COLOR) as VehicleStatus[]).filter((s) => s !== "retired").map((s) => (
          <div key={s} className="flex items-center gap-2 text-[11px] font-semibold text-on-surface tracking-wide uppercase">
            <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: PIN_COLOR[s] }} />
            {titleCase(s)}
          </div>
        ))}
      </div>
    </div>
  );
}
