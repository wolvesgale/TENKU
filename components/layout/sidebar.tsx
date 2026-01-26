"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, ClipboardList, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const sidebarLinks = [
  { href: "/", label: "デモホーム", icon: Home },
  { href: "/organization", label: "監理団体情報", icon: Building2 },
  { href: "/companies", label: "法人（実習実施者）", icon: Building2 },
  { href: "/persons", label: "実習生", icon: Users },
  { href: "/training-plans", label: "技能実習計画", icon: ClipboardList },
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
          <p className="text-[11px] uppercase tracking-wide text-muted">TENKU_Cloud</p>
          <p className="font-semibold text-white">Command Board</p>
        </div>
      </div>
      <nav className="space-y-1">
        {sidebarLinks.map((link) => {
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
