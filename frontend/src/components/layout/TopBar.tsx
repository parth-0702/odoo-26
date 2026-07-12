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
    <header className="h-16 sticky top-0 z-20 bg-background/90 backdrop-blur-xl border-b border-border flex items-center gap-3 px-md sm:px-lg">
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
        className="flex-1 max-w-md flex items-center gap-3 h-10 px-md rounded-full bg-surface border border-border text-on-surface-variant hover:shadow-md transition-all duration-200 ease-out"
      >
        <Icon name="search" className="text-[20px]" />
        <span className="text-body-md flex-1 text-left font-medium">Search fleet…</span>
        <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full bg-surface-container border border-border font-bold">
          Ctrl K
        </kbd>
      </button>

      <div className="flex-1" />

      {/* Role chip */}
      {role && (
        <span className="hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-full bg-sunshine border border-border text-[#2B2B2F] text-data-tabular font-bold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {ROLE_LABELS[role]}
        </span>
      )}

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen((o) => !o)}
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface border border-border bg-surface hover:shadow-sm transition-all duration-200 ease-out"
          aria-label="Notifications"
        >
          <Icon name="notifications" className="text-[20px]" />
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary border border-background text-white text-[10px] font-bold flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
        <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} />
      </div>
    </header>
  );
}
