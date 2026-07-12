import type { Role } from "@/types";

/**
 * Demo sign-in credentials — must match the seeded users created by
 * `backend/src/seed/seed.js`. The Login page is a role switcher with no
 * password field, so when the app is wired to the real API (not mocks) we
 * authenticate behind the scenes using these known demo accounts.
 *
 * Run `npm run seed` in /backend once MONGO_URI is set to create them.
 */
export const DEMO_CREDENTIALS: Record<Role, { email: string; password: string }> = {
  admin: { email: "admin@arjuna.com", password: "Password123!" },
  fleet_manager: { email: "manager@arjuna.com", password: "Password123!" },
  driver: { email: "driver@arjuna.com", password: "Password123!" },
  staff: { email: "staff@arjuna.com", password: "Password123!" },
};
