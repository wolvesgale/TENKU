"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlarmClock,
  BarChart3,
  BookCopy,
  Building2,
  CalendarRange,
  ChevronLeft,
  FileCheck,
  FileSpreadsheet,
  FileWarning,
  Home,
  MessageSquare,
  Menu,
  Sparkles,
  Users,
  Waypoints,
} from "lucide-react";
import { useAuth } from "../providers/AuthProvider";

const menu = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "実習実施先", href: "/companies", icon: Building2 },
  { label: "入国者", href: "/migrants", icon: Users },
  { label: "送出機関", href: "/sending-agencies", icon: Waypoints },
  {
    label: "書類",
    icon: FileCheck,
    children: [
      { label: "計画認定", href: "/documents/plan", icon: BookCopy },
      { label: "各種手続", href: "/documents/procedures", icon: FileSpreadsheet },
      { label: "監査・報告", href: "/documents/audit", icon: FileWarning },
    ],
  },
  { label: "請求", href: "/billing", icon: BarChart3 },
  { label: "CSV", href: "/csv", icon: FileSpreadsheet },
  { label: "スケジュール", href: "/schedule", icon: AlarmClock },
  { label: "書式監視", href: "/templates/monitor", icon: CalendarRange },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`glass-panel border-r border-slate-800/70 h-screen sticky top-0 p-3 flex flex-col gap-4 transition-all ${collapsed ? "w-[82px]" : "w-64"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-teal/50 to-brand-blue/40 border border-brand-blue/50 flex items-center justify-center shadow-neon">
            <Sparkles className="text-white" size={18} />
          </div>
          {!collapsed && (
            <div>
              <p className="text-[10px] text-brand-blue tracking-[0.12em] uppercase">TENKU</p>
              <h1 className="font-bold text-lg text-white">Control</h1>
            </div>
          )}
        </div>
        <button
          aria-label="toggle sidebar"
          onClick={() => setCollapsed((p) => !p)}
          className="p-2 rounded-lg border border-slate-700 hover:border-brand-blue/60"
        >
          {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {!collapsed && <div className="text-xs text-slate-400 px-1">{user ? `${user.role} / ${user.tenantCode}` : "Guest"}</div>}

      <nav className="flex-1 space-y-1 pr-1 overflow-y-auto scrollbar-thin">
        {menu.map((item) => {
          if (item.children) {
            return (
              <div key={item.label} className="space-y-1">
                {!collapsed && <div className="text-[11px] text-slate-500 px-3 uppercase tracking-wide">{item.label}</div>}
                {item.children.map((child) => {
                  const active = pathname?.startsWith(child.href);
                  const Icon = child.icon;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition ${
                        active ? "border-brand-blue/70 bg-brand-blue/10 text-white" : "border-transparent hover:border-brand-blue/30 text-slate-300"
                      }`}
                    >
                      <Icon size={18} className="text-brand-blue" />
                      {!collapsed && <span>{child.label}</span>}
                    </Link>
                  );
                })}
              </div>
            );
          }

          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition ${
                active ? "border-brand-blue/70 bg-brand-blue/10 text-white" : "border-transparent hover:border-brand-blue/30 text-slate-300"
              }`}
            >
              <Icon size={18} className="text-brand-blue" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`text-xs text-slate-500 border-t border-slate-800 pt-3 flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}>
        <MessageSquare size={14} className="text-brand-blue" />
        {!collapsed && <p>AIで運用負荷を軽減</p>}
      </div>
    </aside>
  );
}
