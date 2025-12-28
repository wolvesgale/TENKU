"use client";

import { useAuth } from "../providers/AuthProvider";
import { Bell, LogOut, Search, Shield } from "lucide-react";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-slate-800/70 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 text-slate-300">
        <Shield className="text-brand-teal" size={18} />
        <div>
          <p className="text-xs muted">TENKU Demo</p>
          <p className="font-semibold text-white">管轄・監理オペレーション Hub</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700">
          <Search size={16} className="text-slate-400" />
          <input className="bg-transparent text-sm focus:outline-none" placeholder="グローバル検索 (デモ)" />
        </div>
        <button className="p-2 rounded-lg border border-slate-700 hover:border-brand-blue/70">
          <Bell size={18} className="text-brand-blue" />
        </button>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-brand-blue/50 bg-brand-blue/10">
          <div className="text-left text-sm">
            <p className="text-white font-semibold">{user?.email || "ゲスト"}</p>
            <p className="text-xs text-slate-400">{user?.role || "tenantAdmin"}</p>
          </div>
          <button onClick={logout} className="p-2 rounded-md hover:bg-slate-800">
            <LogOut size={16} className="text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
