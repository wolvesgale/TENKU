"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FileUp, Info, UploadCloud } from "lucide-react";

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
      <div className="flex gap-2">
        <Button onClick={() => setTab("import")} variant={tab === "import" ? "primary" : "ghost"} size="sm">
          インポート
        </Button>
        <Button onClick={() => setTab("export")} variant={tab === "export" ? "primary" : "ghost"} size="sm">
          エクスポート
        </Button>
      </div>

      {tab === "import" ? (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>CSVインポート</CardTitle>
            <Badge className="border-brand-blue text-brand-blue">入力ルール</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-surface border border-brand-blue/40">
                <FileUp className="text-brand-blue" />
              </div>
              <p className="text-sm text-muted">ファイル選択でプレビューを表示（処理はモック）</p>
            </div>
            <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-brand-blue/50 bg-surface/50 rounded-xl p-6 cursor-pointer hover:border-brand-blue">
              <UploadCloud className="text-brand-blue" />
              <p className="text-sm text-gray-100">ファイルをドロップ or クリックで選択</p>
              <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
            </label>
            {preview.length > 0 && (
              <div className="rounded-lg border border-border bg-surface/70 p-3 text-xs text-muted space-y-1">
                {preview.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            )}
            <div className="rounded-lg border border-brand-amber/40 bg-brand-amber/10 p-3 flex gap-2 text-xs text-amber-100">
              <Info size={14} />
              <span>入力ルール: UTF-8 / LF / カンマ区切り。ID列・国コード列は必須。</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>CSVエクスポート</CardTitle>
            <Badge className="border-brand-blue text-brand-blue">手続・請求</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-surface border border-brand-blue/40">
                <FileDown className="text-brand-blue" />
              </div>
              <p className="text-sm text-muted">デモでは固定データを出力する体でUIのみ提供。</p>
            </div>
            <Button className="w-full">エクスポート (モック)</Button>
            <p className="text-xs text-muted">出力対象: 実習生一覧、監理先、請求サマリ</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>インポート履歴</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {importHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-border bg-surface/70 px-3 py-2 text-sm"
            >
              <div>
                <p className="text-white">{item.file}</p>
                <p className="text-xs text-muted">{item.date}</p>
              </div>
              <Badge className={item.status.includes("完了") ? "border-emerald-400 text-emerald-300" : "border-brand-amber text-brand-amber"}>
                {item.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
