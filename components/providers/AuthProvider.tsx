"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export type UserRole = "tenantAdmin" | "tenantStaff" | "migrantUser";

export type User = {
  email: string;
  tenantCode: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  login: (payload: { email: string; password: string; tenantCode: string; role: UserRole }) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CREDENTIALS = {
  tenantCode: process.env.NEXT_PUBLIC_DEMO_TENANT_CODE || "T-739102",
  email: process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@tenku.cloud",
  password: process.env.NEXT_PUBLIC_DEMO_PASSWORD || "tenku-demo42",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("tenku:user") : null;
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem("tenku:user", JSON.stringify(user));
    } else {
      window.localStorage.removeItem("tenku:user");
    }
  }, [user]);

  useEffect(() => {
    if (!user && pathname && pathname !== "/login") {
      router.replace("/login");
    }
  }, [pathname, router, user]);

  const login = useCallback(
    async ({ email, password, tenantCode, role }: { email: string; password: string; tenantCode: string; role: UserRole }) => {
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password && tenantCode === DEMO_CREDENTIALS.tenantCode) {
        const newUser = { email, tenantCode, role };
        setUser(newUser);
        router.push("/dashboard");
        return true;
      }
      return false;
    },
    [router]
  );

  const logout = useCallback(() => {
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(() => ({ user, login, logout }), [login, logout, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
