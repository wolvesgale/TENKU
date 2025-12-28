"use client";

import { useMemo, useState } from "react";
import NeonCard from "@/components/ui/NeonCard";
import ProgressBar from "@/components/ui/ProgressBar";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { migrants } from "@/lib/mockData";
import { CalendarClock, Filter, Globe2, Search, User } from "lucide-react";

export default function MigrantsPage() {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState("all");
  const filtered = useMemo(
    () =>
      migrants.filter(
        (m) =>
          (m.name.toLowerCase().includes(query.toLowerCase()) || m.company.toLowerCase().includes(query.toLowerCase())) &&
          (phase === "all" || m.phase === phase)
      ),
    [query, phase]
  );
  const phases = Array.from(new Set(migrants.map((m) => m.phase)));

  return (
    <div className="space-y-4">
      <SectionHeader title="入国者" description="フィルタ + テーブルで状態を一覧、右上にVISA期限を強調" />
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-700">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="氏名・実習先で検索"
            className="bg-transparent focus:outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-700">
          <Filter size={16} className="text-slate-400" />
          <select value={phase} onChange={(e) => setPhase(e.target.value)} className="bg-transparent text-sm focus:outline-none">
            <option value="all">すべてのフェーズ</option>
            {phases.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <NeonCard className="p-0 overflow-hidden">
        <div className="table-grid text-xs text-slate-400 border-b border-slate-800/80">
          <span className="col-span-3">氏名</span>
          <span className="col-span-3">ステータス</span>
          <span className="col-span-3">所属</span>
          <span className="col-span-2">進捗</span>
          <span className="col-span-1 text-right">期限</span>
        </div>
        <div className="divide-y divide-slate-800/70">
          {filtered.map((m) => (
            <div key={m.id} className="table-grid hover:bg-slate-900/60 transition">
              <div className="col-span-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900/70 border border-brand-blue/40">
                  <User className="text-brand-blue" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">{m.name}</p>
                  <p className="text-[11px] text-slate-400">{m.phase}</p>
                </div>
              </div>
              <p className="col-span-3 text-sm text-slate-300">{m.status}</p>
              <p className="col-span-3 text-sm text-slate-300">{m.company}</p>
              <div className="col-span-2">
                <ProgressBar value={m.completion} />
                <p className="text-[11px] text-slate-500 mt-1">リスク {m.riskScore}</p>
              </div>
              <div className="col-span-1 flex justify-end items-center gap-2">
                <CalendarClock size={14} className="text-brand-blue" />
                <StatusBadge status={m.riskScore > 30 ? "high" : m.riskScore > 20 ? "medium" : "low"}>{m.visaExpireDate}</StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </NeonCard>
    </div>
  );
}
