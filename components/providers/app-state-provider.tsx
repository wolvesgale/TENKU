"use client";
import { createContext, useContext, useMemo, useState } from "react";

export type UserRole = "admin" | "staff" | "foreigner";
export type TenantType = "supervisory_org" | "company_direct";

type AppState = {
  tenantId: string;
  tenantCode: string;
  tenantName: string;
  email: string;
  role: UserRole;
  tenantType: TenantType;
  setTenantId: (v: string) => void;
  setTenantCode: (v: string) => void;
  setTenantName: (v: string) => void;
  setEmail: (v: string) => void;
  setRole: (v: UserRole) => void;
  setTenantType: (v: TenantType) => void;
};

const STORAGE_KEY = "tenku_session";

function loadSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(data: Omit<AppState, `set${string}`>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const saved = loadSession();

  const [tenantId, _setTenantId] = useState<string>(
    saved?.tenantId ?? "tenant_demo"
  );
  const [tenantCode, _setTenantCode] = useState<string>(
    saved?.tenantCode ?? process.env.NEXT_PUBLIC_TENKU_TENANT_CODE ?? "240224"
  );
  const [tenantName, _setTenantName] = useState<string>(
    saved?.tenantName ?? "TENKU_Cloud"
  );
  const [email, _setEmail] = useState<string>(
    saved?.email ?? ""
  );
  const [role, _setRole] = useState<UserRole>(saved?.role ?? "admin");
  const [tenantType, _setTenantType] = useState<TenantType>(
    saved?.tenantType ?? "supervisory_org"
  );

  const persist = (patch: Partial<Omit<AppState, `set${string}`>>) => {
    const next = { tenantId, tenantCode, tenantName, email, role, tenantType, ...patch };
    saveSession(next);
  };

  const setTenantId    = (v: string)     => { _setTenantId(v);    persist({ tenantId: v }); };
  const setTenantCode  = (v: string)     => { _setTenantCode(v);  persist({ tenantCode: v }); };
  const setTenantName  = (v: string)     => { _setTenantName(v);  persist({ tenantName: v }); };
  const setEmail       = (v: string)     => { _setEmail(v);       persist({ email: v }); };
  const setRole        = (v: UserRole)   => { _setRole(v);        persist({ role: v }); };
  const setTenantType  = (v: TenantType) => { _setTenantType(v);  persist({ tenantType: v }); };

  const value = useMemo(
    () => ({ tenantId, tenantCode, tenantName, email, role, tenantType,
             setTenantId, setTenantCode, setTenantName, setEmail, setRole, setTenantType }),
    [tenantId, tenantCode, tenantName, email, role, tenantType]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
