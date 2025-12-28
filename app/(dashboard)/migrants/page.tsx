"use client";

import { useMemo, useState } from "react";
import NeonCard from "@/components/ui/NeonCard";
import ProgressBar from "@/components/ui/ProgressBar";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { migrants } from "@/lib/mockData";
import { CalendarClock, Search, User } from "lucide-react";

export default function MigrantsPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => migrants.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.company.includes(query)), [query]);

  return (
    <div className="space-y-4">
      <SectionHeader title="入国者" description="技能実習/特定技能を一覧。期限・フェーズを強調" />
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="氏名・実習先で検索"
            className="bg-transparent focus:outline-none text-sm"
          />
        </div>
      </div>

      <NeonCard className="p-4 space-y-3">
        {filtered.map((m) => (
          <div key={m.id} className="rounded-lg border border-slate-800/70 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900/70 border border-neon-cyan/40">
                  <User className="text-neon-cyan" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">{m.name}</p>
                  <p className="text-xs text-slate-400">{m.status} / {m.company}</p>
                </div>
              </div>
              <StatusBadge status={m.riskScore > 30 ? "high" : m.riskScore > 20 ? "medium" : "low"}>リスク {m.riskScore}</StatusBadge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><CalendarClock size={12} /> VISA期限 {m.visaExpireDate}</span>
              <span>フェーズ: {m.phase}</span>
              <span>進捗: {m.completion}%</span>
            </div>
            <ProgressBar value={m.completion} />
            <div className="mt-2 text-xs text-slate-500">対応履歴（UI枠）: フィードバック入力、OJTレポート添付予定</div>
          </div>
        ))}
      </NeonCard>
    </div>
  );
}
