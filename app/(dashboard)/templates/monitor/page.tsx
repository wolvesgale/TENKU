"use client";

import { useState } from "react";
import NeonCard from "@/components/ui/NeonCard";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { templateMonitors } from "@/lib/mockData";
import { Globe2, RefreshCw, Sparkles } from "lucide-react";

export default function TemplateMonitorPage() {
  const [result, setResult] = useState<string>("");

  const handleDiff = (name: string, hasDiff: boolean) => {
    setResult(`${name} の差分チェック: ${hasDiff ? "変更あり" : "変更なし"}`);
    alert(`${name} の差分を確認しました (モック)`);
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="行政書式の更新検知" description="監視URL + ハッシュ比較 + AI提案" />
      <NeonCard className="p-4 space-y-3">
        {templateMonitors.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-800/70 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe2 className="text-brand-blue" size={18} />
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.url}</p>
                </div>
              </div>
              <StatusBadge status={item.hasDiff ? "high" : "low"}>{item.hasDiff ? "変更あり" : "変更なし"}</StatusBadge>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleDiff(item.name, item.hasDiff)} className="button-ghost text-xs flex items-center gap-1">
                <RefreshCw size={14} /> 差分チェック
              </button>
              <button className="btn-primary text-xs py-1 flex items-center gap-1">
                <Sparkles size={14} /> AIサマリ
              </button>
            </div>
            <div className="mt-2 grid md:grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800/80">
                <p className="text-slate-400 mb-1">変更点の要約 (AI)</p>
                <p>{item.aiSummary}</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800/80">
                <p className="text-slate-400 mb-1">テンプレ更新案</p>
                <p>{item.proposal}</p>
              </div>
            </div>
          </div>
        ))}
      </NeonCard>

      {result && <div className="text-sm text-brand-teal">{result}</div>}
    </div>
  );
}
