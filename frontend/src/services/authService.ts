import { apiRequest, mockDelay, tokenStore, USE_MOCKS, ApiError } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { mockUsers } from "@/mocks";
import { DEMO_CREDENTIALS } from "@/config/demoAuth";
import type { Role, User } from "@/types";

interface AuthResponse {
  data: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string, role?: Role): Promise<User> {
    if (USE_MOCKS) {
      // Demo auth: match by email, or fall back to selected role.
      const user =
        mockUsers.find((u) => u.email === email.toLowerCase()) ||
        mockUsers.find((u) => u.role === role) ||
        mockUsers[0];
      tokenStore.set(`mock-token-${user._id}`);
      localStorage.setItem("arjuna_mock_user", JSON.stringify(user));
      return mockDelay(user, 500);
    }
    // Real API: the role-switcher UI collects no password, so fall back to
    // the seeded demo account for the chosen role (see config/demoAuth.ts).
    const isDemoRoleLogin = !email && !password && !!role;
    const creds = isDemoRoleLogin
      ? DEMO_CREDENTIALS[role]
      : { email, password };
    try {
      const res = await apiRequest<AuthResponse>(ENDPOINTS.auth.login, {
        method: "POST",
        body: JSON.stringify({ ...creds, role }),
      });
      tokenStore.set(res.token);
      return res.data;
    } catch (err) {
      // A 401 here almost always means the demo user hasn't been seeded
      // into MongoDB yet (or the backend is pointed at a different
      // MONGO_URI than the one that was seeded). Surface that clearly
      // instead of the generic "Invalid email or password".
      if (isDemoRoleLogin && err instanceof ApiError && err.status === 401) {
        throw new Error(
          `Couldn't sign in as ${creds.email}. Run "npm run seed" in /backend against ` +
            `the MongoDB in backend/.env (MONGO_URI) to create the demo accounts, then try again.`
        );
      }
      throw err;
    }
  },

  async me(): Promise<User | null> {
    if (USE_MOCKS) {
      const raw = localStorage.getItem("arjuna_mock_user");
      return mockDelay(raw ? (JSON.parse(raw) as User) : null, 200);
    }
    if (!tokenStore.get()) return null;
    try {
      const res = await apiRequest<{ data: User }>(ENDPOINTS.auth.me);
      return res.data;
    } catch (err) {
      // Stale/expired/invalid token — clear it so we don't keep retrying
      // a doomed request on every reload, and so the app cleanly falls
      // back to the login screen.
      if (err instanceof ApiError && err.status === 401) {
        tokenStore.clear();
        return null;
      }
      throw err;
    }
  },

  logout() {
    tokenStore.clear();
    localStorage.removeItem("arjuna_mock_user");
  },
};