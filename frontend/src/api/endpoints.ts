export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
  },
  vehicles: "/vehicles",
  drivers: "/drivers",
  trips: "/trips",
  shipments: "/shipments",
  maintenance: "/maintenance",
  fuelLogs: "/fuel-logs",
  expenses: "/expenses",
  documents: "/documents",
  notifications: "/notifications",
  search: "/search",
} as const;