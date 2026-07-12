import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { titleCase, formatDate } from "@/lib/format";

const sev = { info: "info", warning: "warning", critical: "danger" } as const;

export function NotificationsPage() {
  const { role } = useAuth();
  const { items, loading, unread, markRead, markAllRead } = useNotifications(role);

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Notification Center"
        subtitle={`${unread} unread`}
        actions={unread > 0 && <Button variant="secondary" onClick={markAllRead}><Icon name="done_all" className="text-[18px]" /> Mark all read</Button>}
      />
      {loading ? <SkeletonRows rows={6} /> : items.length === 0 ? (
        <EmptyState icon="notifications_off" title="You're all caught up" />
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <Card key={n._id} className={n.read ? "opacity-60" : ""}>
              <div className="flex items-start gap-3">
                <Icon name="notifications" className="text-[20px] text-primary mt-0.5" filled />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-body-md text-on-surface font-medium">{n.title}</span>
                    <Badge tone={sev[n.severity]}>{titleCase(n.severity)}</Badge>
                  </div>
                  <p className="text-[13px] text-on-surface-variant mt-0.5">{n.message}</p>
                  <span className="text-[11px] text-on-surface-variant/60">{formatDate(n.createdAt)}</span>
                </div>
                {!n.read && (
                  <button onClick={() => markRead(n._id)} className="text-[12px] text-primary hover:underline shrink-0">
                    Mark read
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}