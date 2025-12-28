"use client";

import { documents, tasks } from "@/lib/mockData";
import NeonCard from "@/components/ui/NeonCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ProgressBar from "@/components/ui/ProgressBar";
import StatusBadge from "@/components/ui/StatusBadge";
import { Clock3, Copy, FileOutput } from "lucide-react";

export default function AuditPage() {
  const audits = documents.filter((d) => d.type === "audit");
  const reminders = tasks.filter((t) => t.relatedEntity.includes("audit"));

  const handleToast = (msg: string) => alert(msg);

  return (
    <div className="space-y-4">
      <SectionHeader title="監査・報告・記録" description="差分チェック + 出力のUI枠" />
      <NeonCard className="p-4 space-y-3">
        {audits.map((doc) => (
          <div key={doc.id} className="rounded-lg border border-slate-800/70 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{doc.name}</p>
                <p className="text-xs text-slate-400">更新: {doc.lastUpdated} / 担当: {doc.owner}</p>
              </div>
              <StatusBadge status={doc.status}>{doc.status}</StatusBadge>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => handleToast("差分を検出しました (モック)")} className="button-ghost text-xs flex items-center gap-1">
                <Copy size={14} /> 差分チェック
              </button>
              <button onClick={() => handleToast("監査報告を出力しました (モック)")} className="button-primary text-xs py-1 flex items-center gap-1">
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
        <SectionHeader title="スケジュール連動" description="監査関連タスクの期限" />
        <div className="space-y-2">
          {reminders.map((task) => (
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
