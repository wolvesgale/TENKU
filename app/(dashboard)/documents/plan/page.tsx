"use client";

import { documents, tasks } from "@/lib/mockData";
import NeonCard from "@/components/ui/NeonCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ProgressBar from "@/components/ui/ProgressBar";
import StatusBadge from "@/components/ui/StatusBadge";
import { Copy, FileOutput, Clock3, LayoutGrid } from "lucide-react";

export default function PlanDocumentsPage() {
  const planDocs = documents.filter((d) => d.type === "plan");
  const deadlines = tasks.filter((t) => t.relatedEntity.includes("documents"));

  const handleToast = (msg: string) => {
    alert(msg);
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="計画認定書類" description="タイプ別カード + 最近使ったテンプレを表示" />

      <div className="grid lg:grid-cols-3 gap-4">
        {planDocs.map((doc) => (
          <NeonCard key={doc.id} className="p-4 space-y-3 border border-slate-800/70">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">計画</p>
                <p className="text-lg font-semibold text-white">{doc.name}</p>
                <p className="text-xs text-slate-500 mt-1">更新: {doc.lastUpdated} / 担当: {doc.owner}</p>
              </div>
              <StatusBadge status={doc.status}>{doc.status}</StatusBadge>
            </div>
            <ProgressBar value={doc.completion} />
            <div className="flex items-center gap-2">
              <button onClick={() => handleToast("複製しました (ダミー)")} className="btn-ghost text-xs flex items-center gap-1">
                <Copy size={14} /> 複製
              </button>
              <button onClick={() => handleToast("出力しました (モック)")} className="btn-primary text-xs py-1 flex items-center gap-1">
                <FileOutput size={14} /> 出力
              </button>
            </div>
          </NeonCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <NeonCard className="p-4">
          <SectionHeader title="スケジュール連動" description="タスク期限を連動表示" />
          <div className="space-y-2">
            {deadlines.map((task) => (
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

        <NeonCard className="p-4">
          <SectionHeader title="最近使ったテンプレ" description="カード型で即参照" />
          <div className="grid grid-cols-1 gap-3">
            {planDocs.slice(0, 2).map((doc) => (
              <div key={doc.id} className="rounded-xl border border-slate-800/70 bg-slate-900/50 p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{doc.name}</p>
                  <p className="text-xs text-slate-500">テンプレ更新日: {doc.lastUpdated}</p>
                </div>
                <LayoutGrid className="text-brand-blue" size={18} />
              </div>
            ))}
          </div>
        </NeonCard>
      </div>
    </div>
  );
}
