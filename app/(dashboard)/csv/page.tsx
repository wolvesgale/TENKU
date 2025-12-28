"use client";

import { useState } from "react";
import NeonCard from "@/components/ui/NeonCard";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { FileUp, FileDown, Info, UploadCloud } from "lucide-react";

const importHistory = [
  { id: "csv-01", file: "migrants_202407.csv", status: "完了", date: "2024-07-30" },
  { id: "csv-02", file: "companies_patch.csv", status: "警告", date: "2024-07-21" },
];

export default function CsvPage() {
  const [tab, setTab] = useState<"import" | "export">("import");
  const [preview, setPreview] = useState<string[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview([`file: ${file.name}`, "header1,header2", "example,row", "mock,data"]);
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="CSV" description="インポート/エクスポート/入力ルール" />
      <div className="flex gap-2">
        <button onClick={() => setTab("import")} className={`px-4 py-2 rounded-lg border ${tab === "import" ? "border-brand-blue/70 bg-brand-blue/10" : "border-slate-700"}`}>
          インポート
        </button>
        <button onClick={() => setTab("export")} className={`px-4 py-2 rounded-lg border ${tab === "export" ? "border-brand-blue/70 bg-brand-blue/10" : "border-slate-700"}`}>
          エクスポート
        </button>
      </div>

      {tab === "import" ? (
        <NeonCard className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-brand-blue/40">
              <FileUp className="text-brand-blue" />
            </div>
            <div>
              <p className="font-semibold text-white">CSVインポート</p>
              <p className="text-xs text-slate-400">ドラッグ&ドロップまたはファイル選択でプレビュー</p>
            </div>
          </div>
          <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-brand-blue/50 bg-slate-900/50 rounded-xl p-6 cursor-pointer hover:border-brand-blue">
            <UploadCloud className="text-brand-blue" />
            <p className="text-sm text-slate-300">ファイルをドロップ or クリックで選択</p>
            <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
          </label>
          {preview.length > 0 && (
            <div className="rounded-lg border border-slate-800/70 bg-slate-900/50 p-3 text-xs text-slate-300 space-y-1">
              {preview.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          )}
          <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-3 flex gap-2 text-xs text-amber-100">
            <Info size={14} />
            <span>入力ルール: UTF-8 / LF / カンマ区切り。ID列・国コード列は必須。</span>
          </div>
        </NeonCard>
      ) : (
        <NeonCard className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-brand-blue/40">
              <FileDown className="text-brand-blue" />
            </div>
            <div>
              <p className="font-semibold text-white">CSVエクスポート</p>
              <p className="text-xs text-slate-400">デモでは固定データを出力</p>
            </div>
          </div>
          <button className="btn-primary w-full">エクスポート (モック)</button>
          <p className="text-xs text-slate-400">出力対象: 実習生一覧、監理先、請求サマリ</p>
        </NeonCard>
      )}

      <NeonCard className="p-4">
        <SectionHeader title="インポート履歴" />
        <div className="space-y-2">
          {importHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/50 px-3 py-2 text-sm">
              <div>
                <p className="text-white">{item.file}</p>
                <p className="text-xs text-slate-500">{item.date}</p>
              </div>
              <StatusBadge status={item.status.includes("完了") ? "done" : "medium"}>{item.status}</StatusBadge>
            </div>
          ))}
        </div>
      </NeonCard>
    </div>
  );
}
