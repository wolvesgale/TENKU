"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlarmClock,
  BarChart3,
  BookCopy,
  Building2,
  CalendarRange,
  FileCheck,
  FileSpreadsheet,
  FileWarning,
  Home,
  MessageCircle,
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

  return (
    <aside className="glass-panel border-r border-slate-800/70 h-screen sticky top-0 p-4 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-neon-green/40 to-neon-cyan/30 border border-neon-cyan/60 flex items-center justify-center shadow-neon">
          <Sparkles className="text-white" size={20} />
        </div>
        <div>
          <p className="text-xs text-neon-cyan tracking-wide">SaaS DEMO</p>
          <h1 className="font-bold text-lg text-white">TENKU</h1>
        </div>
      </div>

      <div className="text-xs text-slate-400 px-1">{user ? `${user.role} / ${user.tenantCode}` : "Guest"}</div>

      <nav className="flex-1 space-y-2 pr-1 overflow-y-auto scrollbar-thin">
        {menu.map((item) => {
          if (item.children) {
            return (
              <div key={item.label} className="space-y-1">
                <div className="text-xs text-slate-400 px-3">{item.label}</div>
                {item.children.map((child) => {
                  const active = pathname?.startsWith(child.href);
                  const Icon = child.icon;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition ${
                        active
                          ? "border-neon-cyan/70 bg-neon-cyan/10 text-white"
                          : "border-transparent hover:border-neon-cyan/30 text-slate-300"
                      }`}
                    >
                      <Icon size={18} className="text-neon-cyan" />
                      <span>{child.label}</span>
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
                active
                  ? "border-neon-cyan/70 bg-neon-cyan/10 text-white"
                  : "border-transparent hover:border-neon-cyan/30 text-slate-300"
              }`}
            >
              <Icon size={18} className="text-neon-cyan" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="text-xs text-slate-500 border-t border-slate-800 pt-3">
        <p>参考システム：KIZUNA</p>
        <p>追加価値：AI + SF UI</p>
      </div>
    </aside>
  );
}
