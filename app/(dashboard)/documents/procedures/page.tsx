"use client";

import { documents } from "@/lib/mockData";
import NeonCard from "@/components/ui/NeonCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ProgressBar from "@/components/ui/ProgressBar";
import StatusBadge from "@/components/ui/StatusBadge";
import { Copy, FileOutput, Clock3 } from "lucide-react";

export default function ProceduresPage() {
  const items = documents.filter((d) => d.type === "procedures");

  const handleToast = (msg: string) => alert(msg);

  return (
    <div className="space-y-4">
      <SectionHeader title="各種手続書類" description="複製・出力をモックで体験" />
      <NeonCard className="p-4 space-y-3">
        {items.map((doc) => (
          <div key={doc.id} className="rounded-lg border border-slate-800/70 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{doc.name}</p>
                <p className="text-xs text-slate-400">最終更新: {doc.lastUpdated} / 担当: {doc.owner}</p>
              </div>
              <StatusBadge status={doc.status}>{doc.status}</StatusBadge>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => handleToast("前月データを複製しました (モック)")} className="button-ghost text-xs flex items-center gap-1">
                <Copy size={14} /> 前月複製
              </button>
              <button onClick={() => handleToast("出力しました (ダミー)")} className="button-primary text-xs py-1 flex items-center gap-1">
                <FileOutput size={14} /> 出力
              </button>
            </div>
            <div className="mt-2">
              <ProgressBar value={doc.completion} />
              <p className="text-xs text-slate-500 mt-1">進捗 {doc.completion}%</p>
            </div>
          </div>
        ))}
      </NeonCard>

      <NeonCard className="p-4">
        <SectionHeader title="期限表示" description="提出期限を日付帯で表示" />
        <div className="space-y-2">
          {items.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/50 px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock3 size={14} className="text-neon-cyan" />
                <span>{doc.name}</span>
              </div>
              <StatusBadge status={doc.completion > 80 ? "low" : "medium"}>残 {Math.max(0, 100 - doc.completion)}%</StatusBadge>
            </div>
          ))}
        </div>
      </NeonCard>
    </div>
  );
}
