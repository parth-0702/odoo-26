import { apiRequest, mockDelay, tokenStore, USE_MOCKS } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { mockUsers } from "@/mocks";
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
    const res = await apiRequest<AuthResponse>(ENDPOINTS.auth.login, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    tokenStore.set(res.token);
    return res.data;
  },

  async me(): Promise<User | null> {
    if (USE_MOCKS) {
      const raw = localStorage.getItem("arjuna_mock_user");
      return mockDelay(raw ? (JSON.parse(raw) as User) : null, 200);
    }
    if (!tokenStore.get()) return null;
    const res = await apiRequest<{ data: User }>(ENDPOINTS.auth.me);
    return res.data;
  },

  logout() {
    tokenStore.clear();
    localStorage.removeItem("arjuna_mock_user");
  },
};