import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AppNotification } from "@/types";

const ICONS: Record<AppNotification["type"], string> = {
  license_expiry: "badge",
  maintenance_reminder: "build",
  trip_delayed: "schedule",
  document_expiry: "description",
  system: "info",
};

const SEVERITY: Record<AppNotification["severity"], string> = {
  info: "text-on-surface-variant",
  warning: "text-tertiary",
  critical: "text-error",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationCenter({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { role } = useAuth();
  const { items, loading, unread, markRead, markAllRead } = useNotifications(role);
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-14 z-50 w-[380px] max-w-[calc(100vw-2rem)] glass-panel rounded-xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-md h-14 border-b border-white/5">
          <div className="flex items-center gap-2">
            <h3 className="text-body-lg font-headline text-on-surface">Notifications</h3>
            {unread > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-on-primary">
                {unread}
              </span>
            )}
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-[12px] text-primary hover:underline">
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
          {loading ? (
            <div className="flex justify-center py-xl"><Spinner /></div>
          ) : items.length === 0 ? (
            <EmptyState icon="notifications_off" title="You're all caught up" />
          ) : (
            items.map((n) => (
              <button
                key={n._id}
                onClick={() => {
                  if (!n.read) markRead(n._id);
                  if (n.link) { navigate(n.link); onClose(); }
                }}
                className={`w-full flex gap-3 px-md py-3 text-left border-b border-white/5 transition-colors hover:bg-white/5 ${
                  n.read ? "opacity-60" : ""
                }`}
              >
                <Icon name={ICONS[n.type]} className={`text-[20px] mt-0.5 ${SEVERITY[n.severity]}`} filled />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-body-md text-on-surface truncate">{n.title}</span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="text-[12px] text-on-surface-variant line-clamp-2 mt-0.5">{n.message}</p>
                  <span className="text-[11px] text-on-surface-variant/60">{timeAgo(n.createdAt)}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}