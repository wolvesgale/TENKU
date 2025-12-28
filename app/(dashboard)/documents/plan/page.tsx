"use client";

import { documents, tasks } from "@/lib/mockData";
import NeonCard from "@/components/ui/NeonCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ProgressBar from "@/components/ui/ProgressBar";
import StatusBadge from "@/components/ui/StatusBadge";
import { Copy, FileOutput, Clock3 } from "lucide-react";

export default function PlanDocumentsPage() {
  const planDocs = documents.filter((d) => d.type === "plan");
  const deadlines = tasks.filter((t) => t.relatedEntity.includes("documents"));

  const handleToast = (msg: string) => {
    alert(msg);
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="計画認定書類" description="一覧 + 複製 + 出力のデモ" />
      <NeonCard className="p-4 space-y-3">
        {planDocs.map((doc) => (
          <div key={doc.id} className="rounded-lg border border-slate-800/70 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{doc.name}</p>
                <p className="text-xs text-slate-400">最終更新: {doc.lastUpdated} / 担当: {doc.owner}</p>
              </div>
              <StatusBadge status={doc.status}>{doc.status}</StatusBadge>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => handleToast("複製しました (ダミー)")} className="button-ghost text-xs flex items-center gap-1">
                <Copy size={14} /> 複製
              </button>
              <button onClick={() => handleToast("出力しました (モック)")} className="button-primary text-xs py-1 flex items-center gap-1">
                <FileOutput size={14} /> 出力
              </button>
            </div>
            <div className="mt-2">
              <ProgressBar value={doc.completion} />
              <p className="text-xs text-slate-500 mt-1">完成度 {doc.completion}% / 状態: {doc.status}</p>
            </div>
          </div>
        ))}
      </NeonCard>

      <NeonCard className="p-4">
        <SectionHeader title="スケジュール連動の期限" description="タスクから期限を生成" />
        <div className="space-y-2">
          {deadlines.map((task) => (
            <div key={task.id} className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/50 px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock3 size={14} className="text-neon-cyan" />
                <span>{task.title}</span>
              </div>
              <StatusBadge status={task.severity}>{task.dueDate}</StatusBadge>
            </div>
          ))}
        </div>
      </NeonCard>
    </div>
  );
}
