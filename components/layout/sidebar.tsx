"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Building2, Landmark, Briefcase, FolderGit2, ListChecks, FileText, Notebook, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/persons", label: "Persons", icon: Users },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/orgs", label: "Orgs", icon: Landmark },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/cases", label: "Cases", icon: FolderGit2 },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/logs", label: "Logs", icon: Notebook },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 hidden md:flex flex-col gap-4 p-4 border-r border-border bg-surface/60">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-teal/70 to-brand-blue/70 flex items-center justify-center text-slate-900 font-bold">T</div>
        <div>
          <p className="text-xs text-muted">TENKU Agent</p>
          <p className="font-semibold text-white">Control Room</p>
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
                "flex items-center gap-3 px-3 py-2 rounded-lg border transition",
                active ? "border-brand-blue text-white bg-brand-blue/10" : "border-transparent text-gray-200 hover:border-border"
              )}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <button onClick={() => signOut()} className="mt-auto flex items-center gap-2 text-sm text-muted hover:text-white">
        <LogOut size={16} /> Sign out
      </button>
    </aside>
  );
}
