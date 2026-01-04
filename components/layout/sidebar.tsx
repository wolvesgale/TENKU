"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  Landmark,
  ListChecks,
  FileText,
  Notebook,
  Users,
  Rocket,
  Sparkles,
  ClipboardList,
  Network,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/companies", label: "実習実施先", icon: Building2 },
  { href: "/migrants", label: "入国者", icon: Users },
  { href: "/sending-agencies", label: "送出機関", icon: Landmark },
  { href: "/documents/plan", label: "計画認定書類", icon: ClipboardList },
  { href: "/documents/procedures", label: "手続書類", icon: FileText },
  { href: "/documents/audit", label: "監査/報告", icon: Notebook },
  { href: "/billing", label: "監理費請求", icon: Rocket },
  { href: "/csv", label: "CSV連携", icon: ListChecks },
  { href: "/schedule", label: "スケジュール", icon: Sparkles },
  { href: "/templates/monitor", label: "書式監視", icon: Network },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-72 hidden md:flex flex-col gap-4 p-5 border-r border-border bg-surface/60">
      <div className="flex items-center gap-2">
        <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-brand-teal/70 to-brand-blue/70 flex items-center justify-center text-slate-900 font-bold shadow-glow">
          T
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted">TENKU</p>
          <p className="font-semibold text-white">Command Board</p>
        </div>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const active = pathname?.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg border transition text-sm",
                active
                  ? "border-brand-blue text-white bg-brand-blue/10 shadow-glow"
                  : "border-transparent text-gray-200 hover:border-border hover:bg-surface/80"
              )}
            >
              <Icon size={18} className={active ? "text-brand-blue" : "text-muted"} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto text-xs text-muted border-t border-border pt-3">
        SF + HUD theme / Mock data / Vercel ready
      </div>
    </aside>
  );
}
