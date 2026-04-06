"use client";
import { createContext, useContext, useMemo, useState } from "react";

type UserRole = "tenantAdmin" | "tenantStaff" | "migrantUser";

type AppState = {
  tenantId: string;
  tenantCode: string;
  tenantName: string;
  email: string;
  role: UserRole;
  setTenantId: (value: string) => void;
  setTenantCode: (value: string) => void;
  setTenantName: (value: string) => void;
  setEmail: (value: string) => void;
  setRole: (value: UserRole) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [tenantId, setTenantId] = useState(process.env.NEXT_PUBLIC_TENKU_TENANT_ID ?? "tenant_demo");
  const [tenantCode, setTenantCode] = useState(process.env.NEXT_PUBLIC_TENKU_TENANT_CODE ?? "240224");
  const [tenantName, setTenantName] = useState(process.env.NEXT_PUBLIC_TENKU_TENANT_NAME ?? "TENKU監理協同組合");
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_TENKU_DEMO_EMAIL ?? "support@techtas.jp");
  const [role, setRole] = useState<UserRole>("tenantAdmin");

  const value = useMemo(
    () => ({ tenantId, tenantCode, tenantName, email, role, setTenantId, setTenantCode, setTenantName, setEmail, setRole }),
    [tenantId, tenantCode, tenantName, email, role]
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
