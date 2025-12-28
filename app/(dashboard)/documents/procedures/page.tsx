"use client";

import { documents } from "@/lib/mockData";
import NeonCard from "@/components/ui/NeonCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ProgressBar from "@/components/ui/ProgressBar";
import StatusBadge from "@/components/ui/StatusBadge";
import { Copy, FileOutput, Clock3, Sparkles } from "lucide-react";

export default function ProceduresPage() {
  const items = documents.filter((d) => d.type === "procedures");

  const handleToast = (msg: string) => alert(msg);

  return (
    <div className="space-y-4">
      <SectionHeader title="各種手続" description="グリッドカード + 期限ハイライト" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((doc) => (
          <NeonCard key={doc.id} className="p-4 space-y-3 border border-slate-800/70">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">手続</p>
                <p className="font-semibold text-white">{doc.name}</p>
                <p className="text-xs text-slate-500">最終更新: {doc.lastUpdated}</p>
              </div>
              <StatusBadge status={doc.status}>{doc.status}</StatusBadge>
            </div>
            <ProgressBar value={doc.completion} />
            <div className="flex items-center gap-2">
              <button onClick={() => handleToast("前月データを複製しました (モック)")} className="btn-ghost text-xs flex items-center gap-1">
                <Copy size={14} /> 前月複製
              </button>
              <button onClick={() => handleToast("出力しました (ダミー)")} className="btn-primary text-xs py-1 flex items-center gap-1">
                <FileOutput size={14} /> 出力
              </button>
            </div>
          </NeonCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <NeonCard className="p-4">
          <SectionHeader title="期限表示" description="提出期限を日付帯で表示" />
          <div className="space-y-2">
            {items.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/50 px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock3 size={14} className="text-brand-blue" />
                  <span>{doc.name}</span>
                </div>
                <StatusBadge status={doc.completion > 80 ? "low" : "medium"}>残 {Math.max(0, 100 - doc.completion)}%</StatusBadge>
              </div>
            ))}
          </div>
        </NeonCard>

        <NeonCard className="p-4">
          <SectionHeader title="最近使ったテンプレ" description="手続きに紐づくテンプレをAI要約へ" />
          <div className="space-y-2">
            {items.slice(0, 2).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/50 px-3 py-2">
                <div>
                  <p className="text-white font-semibold">{doc.name}</p>
                  <p className="text-[11px] text-slate-500">利用率: {doc.completion}%</p>
                </div>
                <Sparkles className="text-brand-teal" size={18} />
              </div>
            ))}
          </div>
        </NeonCard>
      </div>
    </div>
  );
}
