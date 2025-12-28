"use client";

import { documents, tasks } from "@/lib/mockData";
import NeonCard from "@/components/ui/NeonCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ProgressBar from "@/components/ui/ProgressBar";
import StatusBadge from "@/components/ui/StatusBadge";
import { Clock3, Copy, FileOutput, ShieldCheck } from "lucide-react";

export default function AuditPage() {
  const audits = documents.filter((d) => d.type === "audit");
  const reminders = tasks.filter((t) => t.relatedEntity.includes("audit"));

  const handleToast = (msg: string) => alert(msg);

  return (
    <div className="space-y-4">
      <SectionHeader title="監査・報告・記録" description="差分チェック + 出力をカードグリッドで整理" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {audits.map((doc) => (
          <NeonCard key={doc.id} className="p-4 space-y-3 border border-slate-800/70">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">監査</p>
                <p className="font-semibold text-white">{doc.name}</p>
                <p className="text-xs text-slate-500">更新: {doc.lastUpdated} / 担当: {doc.owner}</p>
              </div>
              <StatusBadge status={doc.status}>{doc.status}</StatusBadge>
            </div>
            <ProgressBar value={doc.completion} />
            <div className="flex items-center gap-2">
              <button onClick={() => handleToast("差分を検出しました (モック)")} className="btn-ghost text-xs flex items-center gap-1">
                <Copy size={14} /> 差分チェック
              </button>
              <button onClick={() => handleToast("監査報告を出力しました (モック)")} className="btn-primary text-xs py-1 flex items-center gap-1">
                <FileOutput size={14} /> 出力
              </button>
            </div>
          </NeonCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <NeonCard className="p-4">
          <SectionHeader title="スケジュール連動" description="監査関連タスクの期限" />
          <div className="space-y-2">
            {reminders.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/50 px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock3 size={14} className="text-brand-blue" />
                  <span>{task.title}</span>
                </div>
                <StatusBadge status={task.severity}>{task.dueDate}</StatusBadge>
              </div>
            ))}
          </div>
        </NeonCard>

        <NeonCard className="p-4 space-y-3">
          <SectionHeader title="確認済みの安全項目" description="AIによる確認済みチェックの例" />
          <div className="space-y-2">
            {audits.slice(0, 2).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-brand-teal" size={16} />
                  <p className="text-sm text-white">{doc.name}</p>
                </div>
                <StatusBadge status="done">OK</StatusBadge>
              </div>
            ))}
          </div>
        </NeonCard>
      </div>
    </div>
  );
}
