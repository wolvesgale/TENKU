"use client";
import { createContext, useContext, useMemo, useState } from "react";

type UserRole = "tenantAdmin" | "tenantStaff" | "migrantUser";

type AppState = {
  tenantCode: string;
  email: string;
  role: UserRole;
  setTenantCode: (value: string) => void;
  setEmail: (value: string) => void;
  setRole: (value: UserRole) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [tenantCode, setTenantCode] = useState(process.env.NEXT_PUBLIC_TENKU_TENANT_CODE ?? "240224");
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_TENKU_DEMO_EMAIL ?? "support@techtas.jp");
  const [role, setRole] = useState<UserRole>("tenantAdmin");

  const value = useMemo(
    () => ({ tenantCode, email, role, setTenantCode, setEmail, setRole }),
    [tenantCode, email, role]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return ctx;
}
