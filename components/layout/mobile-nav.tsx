"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Construction } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarSections } from "@/components/layout/sidebar";

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
          <div className="absolute left-0 top-0 z-50 h-full w-72 bg-slate-950 border border-slate-800 p-4 flex flex-col gap-3 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-teal/70 to-brand-blue/70 flex items-center justify-center text-slate-900 font-bold shadow-glow">
                  T
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted">TENKU_Cloud</p>
                  <p className="font-semibold text-white text-sm">AI Agent</p>
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

            <nav className="space-y-2 flex-1">
              {sidebarSections.map((section) => (
                <div key={section.label}>
                  <p className="px-2 text-[10px] uppercase tracking-widest text-muted mb-1">
                    {section.label}
                  </p>
                  <div className="space-y-0.5">
                    {section.links.map((link) => {
                      const active = pathname?.startsWith(link.href);
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition text-sm",
                            active
                              ? "border-brand-blue text-white bg-brand-blue/10 shadow-glow"
                              : "border-transparent text-gray-200 hover:border-border hover:bg-surface/80"
                          )}
                        >
                          <Icon size={15} className={active ? "text-brand-blue" : "text-muted"} />
                          <span className="flex-1">{link.label}</span>
                          {link.wip && (
                            <Construction size={11} className="text-brand-amber shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="text-[10px] text-muted border-t border-border pt-2">
              <div className="flex items-center gap-1 text-brand-amber">
                <Construction size={10} />
                工事中 = 開発中機能
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
