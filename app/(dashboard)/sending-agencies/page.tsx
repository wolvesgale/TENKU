"use client";

import { useMemo, useState } from "react";
import NeonCard from "@/components/ui/NeonCard";
import ProgressBar from "@/components/ui/ProgressBar";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { sendingAgencies } from "@/lib/mockData";
import { Globe2, Search, Users } from "lucide-react";

export default function SendingAgenciesPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => sendingAgencies.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.country.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <div className="space-y-4">
      <SectionHeader title="送出機関" description="国・窓口を整理したモダンなテーブルビュー" />
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-700">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="名称・国で検索"
            className="bg-transparent focus:outline-none text-sm"
          />
        </div>
      </div>

      <NeonCard className="p-0 overflow-hidden">
        <div className="table-grid text-xs text-slate-400 border-b border-slate-800/80">
          <span className="col-span-4">名称</span>
          <span className="col-span-3">国</span>
          <span className="col-span-2">担当</span>
          <span className="col-span-2">進捗</span>
          <span className="col-span-1 text-right">リスク</span>
        </div>
        <div className="divide-y divide-slate-800/70">
          {filtered.map((s) => (
            <div key={s.id} className="table-grid hover:bg-slate-900/60 transition">
              <div className="col-span-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900/70 border border-brand-blue/40">
                  <Globe2 className="text-brand-blue" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">{s.name}</p>
                  <p className="text-[11px] text-slate-400">管理 {s.migrants} 名</p>
                </div>
              </div>
              <p className="col-span-3 text-sm text-slate-300">{s.country}</p>
              <p className="col-span-2 text-sm text-slate-300">{s.contact}</p>
              <div className="col-span-2">
                <ProgressBar value={s.completion} />
              </div>
              <div className="col-span-1 flex justify-end">
                <StatusBadge status={s.riskScore > 22 ? "high" : s.riskScore > 16 ? "medium" : "low"}>{s.riskScore}</StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </NeonCard>
    </div>
  );
}
