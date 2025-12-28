"use client";

import { useMemo, useState } from "react";
import NeonCard from "@/components/ui/NeonCard";
import ProgressBar from "@/components/ui/ProgressBar";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { companies } from "@/lib/mockData";
import { Building2, Filter, NotebookPen, Search } from "lucide-react";

export default function CompaniesPage() {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("all");
  const [selected, setSelected] = useState<string | null>(companies[0]?.id ?? null);
  const filtered = useMemo(
    () =>
      companies.filter(
        (c) =>
          (c.name.toLowerCase().includes(query.toLowerCase()) || c.location.toLowerCase().includes(query.toLowerCase())) &&
          (sector === "all" || c.sector === sector)
      ),
    [query, sector]
  );
  const detail = filtered.find((c) => c.id === selected) ?? filtered[0];
  const sectors = Array.from(new Set(companies.map((c) => c.sector)));

  return (
    <div className="space-y-4">
      <SectionHeader title="実習実施先" description="フィルタ + テーブル + 右サマリーでモダンな一覧を表示" />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-700">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="名称・所在地で検索"
            className="bg-transparent focus:outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-700">
          <Filter size={16} className="text-slate-400" />
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="bg-transparent text-sm focus:outline-none"
          >
            <option value="all">全セクター</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid xl:grid-cols-[2fr_1fr] gap-4">
        <NeonCard className="p-0 overflow-hidden">
          <div className="table-grid text-xs text-slate-400 border-b border-slate-800/80">
            <span className="col-span-4">名称</span>
            <span className="col-span-3">所在地</span>
            <span className="col-span-2">受入</span>
            <span className="col-span-2">進捗</span>
            <span className="col-span-1 text-right">リスク</span>
          </div>
          <div className="divide-y divide-slate-800/70">
            {filtered.map((company) => (
              <button
                key={company.id}
                onClick={() => setSelected(company.id)}
                className={`table-grid w-full text-left transition ${
                  selected === company.id ? "bg-brand-blue/5" : "hover:bg-slate-900/60"
                }`}
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900/70 border border-brand-blue/40">
                    <Building2 className="text-brand-blue" size={18} />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{company.name}</p>
                    <p className="text-[11px] text-slate-400">セクター: {company.sector}</p>
                  </div>
                </div>
                <p className="col-span-3 text-sm text-slate-300">{company.location}</p>
                <p className="col-span-2 text-sm text-slate-300">{company.trainees} 名</p>
                <div className="col-span-2">
                  <ProgressBar value={company.completion} />
                </div>
                <div className="col-span-1 flex justify-end">
                  <StatusBadge status={company.riskScore > 26 ? "high" : company.riskScore > 18 ? "medium" : "low"}>
                    {company.riskScore}
                  </StatusBadge>
                </div>
              </button>
            ))}
          </div>
        </NeonCard>

        {detail && (
          <NeonCard className="p-4 space-y-3">
            <SectionHeader title="サマリー" description="AIレコメンドに渡すハイライト" action={<button className="btn-ghost text-xs">編集（モック）</button>} />
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
                  <NotebookPen size={14} className="text-brand-blue mt-0.5" />
                  <div>
                    <p className="text-white">2024-08-01</p>
                    <p className="text-slate-400">品質是正のチェックリストを共有済み。次の監査で検証予定。</p>
                  </div>
                </div>
                <textarea
                  className="w-full rounded-lg bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm focus:border-brand-blue/70 focus:outline-none"
                  placeholder="メモを追加（デモでは保存されません）"
                  rows={3}
                />
                <button className="btn-primary w-full py-2">メモを追加 (モック)</button>
              </div>
            </div>
          </NeonCard>
        )}
      </div>
    </div>
  );
}
