"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarLinks } from "@/components/layout/sidebar";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg border border-border hover:border-brand-blue"
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </button>
      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 z-40 bg-black/70"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
          />
          <div className="absolute left-0 top-0 z-50 h-full w-72 bg-slate-950 border border-slate-800 p-5 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-brand-teal/70 to-brand-blue/70 flex items-center justify-center text-slate-900 font-bold shadow-glow">
                  T
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted">TENKU</p>
                  <p className="font-semibold text-white">Command Board</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg border border-border hover:border-brand-blue"
                aria-label="Close navigation menu"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const active = pathname?.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
