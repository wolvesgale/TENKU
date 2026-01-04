"use client";
import { useProgram } from "@/components/providers/program-provider";
import { programLabels } from "@/lib/utils";
import { Bell, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";

export function Topbar() {
  const { data } = useSession();
  const { program, setProgram } = useProgram();

  return (
    <header className="sticky top-0 z-20 h-16 px-4 border-b border-border bg-surface/80 backdrop-blur-xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 rounded-full border border-border text-sm text-muted">TENKU AI Agent</div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">Program</span>
          <select value={program} onChange={(e) => setProgram(e.target.value as any)} className="text-sm bg-surface">
            {Object.entries(programLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg border border-border hover:border-brand-blue">
          <Bell size={16} />
        </button>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface">
          <div>
            <p className="text-sm text-white">{data?.user?.email ?? "demo@tenku.cloud"}</p>
            <p className="text-xs text-muted">{data?.user ? "Signed in" : "Guest"}</p>
          </div>
          <ChevronDown size={14} className="text-muted" />
        </div>
      </div>
    </header>
  );
}
