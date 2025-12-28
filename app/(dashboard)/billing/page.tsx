"use client";

import { useState } from "react";
import NeonCard from "@/components/ui/NeonCard";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import { BarChart3, Copy, PlusCircle } from "lucide-react";

const mockBreakdown = [
  { label: "技能実習1号", count: 120, amount: 360000 },
  { label: "技能実習2号", count: 86, amount: 301000 },
  { label: "特定技能1号", count: 34, amount: 170000 },
];

export default function BillingPage() {
  const [status, setStatus] = useState("ドラフト生成済み");

  const handleMock = (msg: string) => {
    setStatus(msg);
    alert(`${msg} (モック)`);
  };

  const totalAmount = mockBreakdown.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-4">
      <SectionHeader title="監理費請求" description="新規作成・前月複製 UI" />
      <NeonCard className="p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleMock("新規作成済み")} className="button-primary flex items-center gap-1">
            <PlusCircle size={16} /> 新規作成
          </button>
          <button onClick={() => handleMock("前月複製済み")} className="button-ghost flex items-center gap-1">
            <Copy size={16} /> 前月複製
          </button>
        </div>

        <div className="rounded-lg border border-slate-800/70 bg-slate-900/50 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">ステータス</p>
              <p className="font-semibold text-white">{status}</p>
            </div>
            <StatusBadge status={status.includes("複製") ? "in_progress" : "open"}>{status}</StatusBadge>
          </div>
          <div className="mt-2">
            <ProgressBar value={status.includes("新規") ? 40 : 70} />
            <p className="text-xs text-slate-500 mt-1">種別ごとの人数内訳を参照しながら確定</p>
          </div>
        </div>

        <div className="space-y-3">
          {mockBreakdown.map((b) => (
            <div key={b.label} className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/50 px-3 py-2">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-neon-cyan" />
                <div>
                  <p className="text-white font-semibold">{b.label}</p>
                  <p className="text-xs text-slate-400">人数 {b.count}</p>
                </div>
              </div>
              <p className="text-white font-semibold">¥{b.amount.toLocaleString()}</p>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm text-neon-green border-t border-slate-800 pt-2">
            <span>合計</span>
            <span className="text-xl font-bold">¥{totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </NeonCard>
    </div>
  );
}
