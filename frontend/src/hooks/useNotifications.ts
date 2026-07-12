import { useCallback, useEffect, useState } from "react";
import { notificationService } from "@/services";
import type { AppNotification, Role } from "@/types";

export function useNotifications(role?: Role) {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    notificationService
      .list(role)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [role]);

  useEffect(() => load(), [load]);

  const markRead = async (id: string) => {
    await notificationService.markRead(id);
    setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
  };
  const markAllRead = async () => {
    await notificationService.markAllRead();
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unread = items.filter((n) => !n.read).length;
  return { items, loading, unread, markRead, markAllRead, reload: load };
}