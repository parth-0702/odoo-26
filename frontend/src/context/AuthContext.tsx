import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { authService } from "@/services";
import { can, type Action, type Resource } from "@/config/permissions";
import type { Role, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  role: Role | undefined;
  loading: boolean;
  login: (email: string, password: string, role?: Role) => Promise<User>;
  logout: () => void;
  can: (resource: Resource, action: Action) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const fallbackAuth: AuthContextValue = {
  user: null,
  role: undefined,
  loading: true,
  login: async () => {
    throw new Error("AuthProvider is not available");
  },
  logout: () => {
    /* noop */
  },
  can: () => false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .me()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string, role?: Role) => {
    const u = await authService.login(email, password, role);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role,
      loading,
      login,
      logout,
      can: (resource, action) => can(user?.role, resource, action),
    }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    if (import.meta.env.DEV) {
      console.warn("useAuth called outside AuthProvider; falling back to a safe no-op auth state.");
    }
    return fallbackAuth;
  }
  return ctx;
}