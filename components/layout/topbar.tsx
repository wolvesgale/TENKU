"use client";
import { Bell, Shield, Sparkle, UserCheck } from "lucide-react";
import { useAppState } from "@/components/providers/app-state-provider";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Topbar() {
  const router = useRouter();
  const { email, tenantCode, role, setRole } = useAppState();

  const roleLabel = useMemo(
    () => ({ tenantAdmin: "管理者", tenantStaff: "スタッフ", migrantUser: "利用者" }[role]),
    [role]
  );

  return (
    <header className="sticky top-0 z-20 h-16 px-4 border-b border-border bg-surface/80 backdrop-blur-xl flex items-center justify-between shadow-ambient">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div className="px-3 py-1 rounded-full border border-border text-[12px] text-muted uppercase tracking-wide">TENKU_Cloud</div>
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-brand-blue" />
          <span className="text-sm text-muted">Tenant</span>
          <span className="text-sm font-semibold text-white">{tenantCode}</span>
        </div>
        <button onClick={() => router.push("/login")} className="text-xs text-brand-blue underline underline-offset-4">
          Switch Login
        </button>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface/70">
          <Sparkle size={16} className="text-brand-amber" />
          <p className="text-xs text-muted">AI Ready</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface/70">
          <div className="text-right">
            <p className="text-sm text-white">{email}</p>
            <p className="text-xs text-brand-blue flex items-center gap-1">
              <UserCheck size={12} />
              {roleLabel}
            </p>
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="text-xs bg-transparent border border-border rounded-md px-2 py-1"
          >
            <option value="tenantAdmin">tenantAdmin</option>
            <option value="tenantStaff">tenantStaff</option>
            <option value="migrantUser">migrantUser</option>
          </select>
        </div>
        <button className="p-2 rounded-lg border border-border hover:border-brand-blue">
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}
