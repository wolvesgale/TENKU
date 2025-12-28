"use client";

import { useMemo, useState } from "react";
import NeonCard from "@/components/ui/NeonCard";
import ProgressBar from "@/components/ui/ProgressBar";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { sendingAgencies } from "@/lib/mockData";
import { Globe, Search, Users } from "lucide-react";

export default function SendingAgenciesPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => sendingAgencies.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.country.includes(query)),
    [query]
  );

  return (
    <div className="space-y-4">
      <SectionHeader title="送出機関" description="検索・一覧・対応履歴の枠を提供" />
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="名称・国で検索"
            className="bg-transparent focus:outline-none text-sm"
          />
        </div>
      </div>

      <NeonCard className="p-4 space-y-3">
        {filtered.map((s) => (
          <div key={s.id} className="rounded-lg border border-slate-800/70 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900/70 border border-neon-cyan/40">
                  <Globe className="text-neon-cyan" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">{s.name}</p>
                  <p className="text-xs text-slate-400">{s.country} / 窓口: {s.contact}</p>
                </div>
              </div>
              <StatusBadge status={s.riskScore > 20 ? "high" : s.riskScore > 15 ? "medium" : "low"}>リスク {s.riskScore}</StatusBadge>
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Users size={12} /> 管理人数 {s.migrants}</span>
              <span>進捗 {s.completion}%</span>
            </div>
            <ProgressBar value={s.completion} />
            <div className="mt-2 text-xs text-slate-500">対応履歴（UI枠）: 月次定例の議事録を添付予定。</div>
          </div>
        ))}
      </NeonCard>
    </div>
  );
}
