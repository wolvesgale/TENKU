"use client";

import { useMemo, useState } from "react";
import NeonCard from "@/components/ui/NeonCard";
import ProgressBar from "@/components/ui/ProgressBar";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { companies } from "@/lib/mockData";
import { Building2, NotebookPen, Search } from "lucide-react";

export default function CompaniesPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(companies[0]?.id ?? null);
  const filtered = useMemo(() => companies.filter((c) => c.name.includes(query) || c.location.includes(query)), [query]);
  const detail = filtered.find((c) => c.id === selected) ?? filtered[0];

  return (
    <div className="space-y-4">
      <SectionHeader title="実習実施先" description="検索 + 詳細 + 対応履歴のUI枠" />
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="名称・所在地で検索"
            className="bg-transparent focus:outline-none text-sm"
          />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <NeonCard className="p-3 space-y-2 lg:col-span-2">
          {filtered.map((company) => (
            <button
              key={company.id}
              onClick={() => setSelected(company.id)}
              className={`w-full text-left rounded-lg border px-4 py-3 transition ${
                selected === company.id ? "border-neon-cyan/70 bg-neon-cyan/10" : "border-slate-800/70 hover:border-neon-cyan/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900/70 border border-neon-cyan/40">
                    <Building2 className="text-neon-cyan" size={18} />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{company.name}</p>
                    <p className="text-xs text-slate-400">{company.location} / セクター: {company.sector}</p>
                  </div>
                </div>
                <StatusBadge status={company.riskScore > 25 ? "high" : company.riskScore > 15 ? "medium" : "low"}>
                  リスク {company.riskScore}
                </StatusBadge>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                <span>受入 {company.trainees} 名</span>
                <span className="text-slate-600">|</span>
                <span>完成度 {company.completion}%</span>
                <span className="text-slate-600">|</span>
                <span>次回監査 {company.nextAudit}</span>
              </div>
              <ProgressBar value={company.completion} />
            </button>
          ))}
        </NeonCard>

        {detail && (
          <NeonCard className="p-4 space-y-3">
            <SectionHeader title="詳細" description="編集ボタンはダミー" action={<button className="button-ghost text-xs">編集</button>} />
            <div className="space-y-2 text-sm text-slate-300">
              <p>所在地: {detail.location}</p>
              <p>受入人数: {detail.trainees}名</p>
              <p>リスクスコア: {detail.riskScore}</p>
              <p>次回監査予定: {detail.nextAudit}</p>
              <p>セクター: {detail.sector}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-400">対応履歴（メモ）</p>
              <div className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-3 space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <NotebookPen size={14} className="text-neon-cyan mt-0.5" />
                  <div>
                    <p className="text-white">2024-07-20</p>
                    <p className="text-slate-400">監査指摘の是正計画を共有済み。進捗ウォッチ中。</p>
                  </div>
                </div>
                <textarea
                  className="w-full rounded-lg bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm focus:border-neon-cyan/70 focus:outline-none"
                  placeholder="メモを追加（デモでは保存されません）"
                  rows={3}
                />
                <button className="button-primary w-full py-2">メモを追加 (モック)</button>
              </div>
            </div>
          </NeonCard>
        )}
      </div>
    </div>
  );
}
