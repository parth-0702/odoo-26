import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { Icon } from "@/components/ui/Icon";
import { ROLE_LABELS } from "@/config/permissions";

export function TopBar({
  onOpenSearch,
  onOpenMenu,
}: {
  onOpenSearch: () => void;
  onOpenMenu: () => void;
}) {
  const { role } = useAuth();
  const { unread } = useNotifications(role);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-16 sticky top-0 z-20 bg-surface-container-low/80 backdrop-blur-md border-b border-white/5 flex items-center gap-3 px-md sm:px-lg">
      <button
        onClick={onOpenMenu}
        className="lg:hidden text-on-surface-variant hover:text-on-surface p-1"
        aria-label="Open menu"
      >
        <Icon name="menu" className="text-[24px]" />
      </button>

      {/* Search trigger */}
      <button
        onClick={onOpenSearch}
        className="flex-1 max-w-md flex items-center gap-3 h-10 px-md rounded-lg bg-surface-variant/40 border border-white/5 text-on-surface-variant hover:border-primary/30 transition-colors"
      >
        <Icon name="search" className="text-[20px]" />
        <span className="text-body-md flex-1 text-left">Search fleet…</span>
        <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-surface-container border border-white/10">
          Ctrl K
        </kbd>
      </button>

      <div className="flex-1" />

      {/* Role chip */}
      {role && (
        <span className="hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-primary-container/10 border border-primary/20 text-primary text-data-tabular font-medium">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {ROLE_LABELS[role]}
        </span>
      )}

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen((o) => !o)}
          className="relative w-10 h-10 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors"
          aria-label="Notifications"
        >
          <Icon name="notifications" className="text-[22px]" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
        <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} />
      </div>
    </header>
  );
}