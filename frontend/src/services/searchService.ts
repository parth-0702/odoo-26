import { apiRequest, mockDelay, USE_MOCKS } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { mockVehicles, mockDrivers, mockTrips, mockDocuments } from "@/mocks";
import type { SearchResults } from "@/types";

export const searchService = {
  async search(q: string): Promise<SearchResults> {
    const query = q.trim().toLowerCase();
    if (!query) return { vehicles: [], drivers: [], trips: [], documents: [] };

    if (USE_MOCKS) {
      const has = (s?: string) => (s || "").toLowerCase().includes(query);
      return mockDelay(
        {
          vehicles: mockVehicles.filter((v) => has(v.registrationNumber) || has(v.make) || has(v.model)).slice(0, 6),
          drivers: mockDrivers.filter((d) => has(d.name) || has(d.employeeId) || has(d.licenseNumber)).slice(0, 6),
          trips: mockTrips.filter((t) => has(t.reference) || has(t.origin) || has(t.destination)).slice(0, 6),
          documents: mockDocuments.filter((d) => has(d.documentNumber) || has(d.docType)).slice(0, 6),
        },
        250
      );
    }
    const res = await apiRequest<{ data: SearchResults }>(ENDPOINTS.search, { params: { q } });
    return res.data;
  },
};