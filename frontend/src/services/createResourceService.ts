import { apiRequest, mockDelay, USE_MOCKS } from "@/api/client";
import type { Paginated } from "@/types";

export interface ResourceService<T> {
  list: (params?: Record<string, string | number | undefined>) => Promise<T[]>;
  get: (id: string) => Promise<T>;
  create: (payload: Partial<T>) => Promise<T>;
  update: (id: string, payload: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

/**
 * Factory that produces a CRUD service backed by the API, or by an in-memory
 * mock array when USE_MOCKS is true. Swapping to the real API requires no
 * changes in hooks or components.
 */
export function createResourceService<T extends { _id: string }>(
  endpoint: string,
  mockData: T[]
): ResourceService<T> {
  let store = [...mockData];

  return {
    async list(params) {
      if (USE_MOCKS) return mockDelay([...store]);
      const res = await apiRequest<Paginated<T>>(endpoint, { params });
      return res.data;
    },
    async get(id) {
      if (USE_MOCKS) {
        const found = store.find((x) => x._id === id);
        if (!found) throw new Error("Not found");
        return mockDelay(found);
      }
      const res = await apiRequest<{ data: T }>(`${endpoint}/${id}`);
      return res.data;
    },
    async create(payload) {
      if (USE_MOCKS) {
        const item = { ...(payload as T), _id: `mock-${Date.now()}` };
        store = [item, ...store];
        return mockDelay(item, 400);
      }
      const res = await apiRequest<{ data: T }>(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return res.data;
    },
    async update(id, payload) {
      if (USE_MOCKS) {
        store = store.map((x) => (x._id === id ? { ...x, ...payload } : x));
        return mockDelay(store.find((x) => x._id === id) as T, 400);
      }
      const res = await apiRequest<{ data: T }>(`${endpoint}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      return res.data;
    },
    async remove(id) {
      if (USE_MOCKS) {
        store = store.filter((x) => x._id !== id);
        return mockDelay(undefined, 300);
      }
      await apiRequest<void>(`${endpoint}/${id}`, { method: "DELETE" });
    },
  };
}