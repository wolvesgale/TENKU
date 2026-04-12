"use client";
import { createContext, useContext, useMemo, useState, useEffect } from "react";

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

function saveSession(data: {
  tenantId: string;
  tenantCode: string;
  tenantName: string;
  email: string;
  role: UserRole;
}) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const saved = loadSession();

  const [tenantId, _setTenantId] = useState<string>(
    saved?.tenantId ?? process.env.NEXT_PUBLIC_TENKU_TENANT_ID ?? "tenant_demo"
  );
  const [tenantCode, _setTenantCode] = useState<string>(
    saved?.tenantCode ?? process.env.NEXT_PUBLIC_TENKU_TENANT_CODE ?? "240224"
  );
  const [tenantName, _setTenantName] = useState<string>(
    saved?.tenantName ?? process.env.NEXT_PUBLIC_TENKU_TENANT_NAME ?? "TENKU監理協同組合"
  );
  const [email, _setEmail] = useState<string>(
    saved?.email ?? process.env.NEXT_PUBLIC_TENKU_DEMO_EMAIL ?? "support@techtas.jp"
  );
  const [role, _setRole] = useState<UserRole>(saved?.role ?? "tenantAdmin");

  // localStorageに書き込むラッパー
  const persist = (patch: Partial<{ tenantId: string; tenantCode: string; tenantName: string; email: string; role: UserRole }>) => {
    const next = { tenantId, tenantCode, tenantName, email, role, ...patch };
    saveSession(next);
  };

  const setTenantId = (v: string) => { _setTenantId(v); persist({ tenantId: v }); };
  const setTenantCode = (v: string) => { _setTenantCode(v); persist({ tenantCode: v }); };
  const setTenantName = (v: string) => { _setTenantName(v); persist({ tenantName: v }); };
  const setEmail = (v: string) => { _setEmail(v); persist({ email: v }); };
  const setRole = (v: UserRole) => { _setRole(v); persist({ role: v }); };

  const value = useMemo(
    () => ({ tenantId, tenantCode, tenantName, email, role, setTenantId, setTenantCode, setTenantName, setEmail, setRole }),
    [tenantId, tenantCode, tenantName, email, role]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
