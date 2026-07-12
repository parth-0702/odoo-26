import { apiRequest, mockDelay, USE_MOCKS } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { mockNotifications } from "@/mocks";
import type { AppNotification, Role } from "@/types";

let store = [...mockNotifications];

export const notificationService = {
  async list(role?: Role): Promise<AppNotification[]> {
    if (USE_MOCKS) {
      const scoped = store.filter(
        (n) => !n.audienceRoles?.length || (role && n.audienceRoles.includes(role))
      );
      return mockDelay(scoped);
    }
    const res = await apiRequest<{ data: AppNotification[] }>(ENDPOINTS.notifications);
    return res.data;
  },
  async markRead(id: string): Promise<void> {
    if (USE_MOCKS) {
      store = store.map((n) => (n._id === id ? { ...n, read: true } : n));
      return mockDelay(undefined, 150);
    }
    await apiRequest<void>(`${ENDPOINTS.notifications}/${id}/read`, { method: "PUT" });
  },
  async markAllRead(): Promise<void> {
    if (USE_MOCKS) {
      store = store.map((n) => ({ ...n, read: true }));
      return mockDelay(undefined, 200);
    }
    await apiRequest<void>(`${ENDPOINTS.notifications}/read-all`, { method: "PUT" });
  },
};