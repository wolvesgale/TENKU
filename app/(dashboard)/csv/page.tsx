"use client";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImportResult } from "@/components/import/ImportResult";
import type { ImportFailure, ImportResultData, ImportSuccess } from "@/components/import/ImportResult";
import { FileDown, FileUp, Info, ListChecks, Repeat2, UploadCloud } from "lucide-react";

const importHistory = [
  { id: "csv-01", file: "migrants_202407.csv", status: "完了", date: "2024-07-30" },
  { id: "csv-02", file: "companies_patch.csv", status: "警告", date: "2024-07-21" },
];

export default function CsvPage() {
  const [tab, setTab] = useState<"import" | "export">("import");
  const [preview, setPreview] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResultData | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const createFailures = useCallback<() => ImportFailure[]>(() => {
    const reasons = ["必須項目の欠落", "型不一致", "値が許容範囲外", "ID重複", "日付フォーマット不正"];
    return Array.from({ length: 64 }, (_, index) => ({
      line: index + 2,
      recordId: `REC-${(index + 1).toString().padStart(4, "0")}`,
      reason: `${reasons[index % reasons.length]} (${index % 2 === 0 ? "国コード" : "生年月日"})`,
    }));
  }, []);

  const createSuccesses = useCallback<() => ImportSuccess[]>(() => {
    return Array.from({ length: 42 }, (_, index) => ({
      line: index + 2,
      recordId: `OK-${(index + 1).toString().padStart(4, "0")}`,
      note: index % 3 === 0 ? "新規追加" : "既存更新",
    }));
  }, []);

  const buildResult = useCallback(
    (file: File): ImportResultData => {
      const failures = createFailures();
      const successes = createSuccesses();
      return {
        fileName: file.name,
        total: failures.length + successes.length,
        successCount: successes.length,
        failureCount: failures.length,
        failures,
        successes,
      };
    },
    [createFailures, createSuccesses]
  );

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview([`file: ${file.name}`, "header1,header2", "example,row", "mock,data"]);
      setSelectedFile(file);
      setImportResult(null);
      setShowResult(false);
    }
  };

  const executeImport = (file?: File | null) => {
    const targetFile = file ?? selectedFile;
    if (!targetFile) return;
    setIsImporting(true);
    const result = buildResult(targetFile);
    setImportResult(result);
    setShowResult(true);
    setIsImporting(false);
  };

  const downloadFailures = useCallback(() => {
    if (!importResult) return;
    const header = "line,record_id,reason";
    const escape = (value: string) => `"${value.replace(/\"/g, "\"\"")}"`;
    const rows = importResult.failures.map((failure) => `${failure.line},${failure.recordId},${escape(failure.reason)}`).join("\n");
    const blob = new Blob([`${header}\n${rows}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${importResult.fileName.replace(/\.csv$/i, "") || "import"}_failures.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [importResult]);

  const activeFileLabel = useMemo(() => selectedFile?.name ?? "ファイル未選択", [selectedFile]);
  const hasSelection = Boolean(selectedFile);

  const handleRetry = () => {
    executeImport(selectedFile);
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
              <div>
                <p className="text-sm text-muted">ファイル選択でプレビューを表示（処理はモック）</p>
                <p className="text-xs text-emerald-200">同じファイルを保持したまま再アップロード可能</p>
              </div>
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
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface/80 p-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3 text-sm text-white">
                <div className="rounded-full bg-brand-blue/20 p-2 border border-brand-blue/50">
                  <ListChecks size={18} className="text-brand-blue" />
                </div>
                <div>
                  <p className="text-xs text-muted">選択中のファイル</p>
                  <p className="font-semibold">{activeFileLabel}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="subtle"
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={!hasSelection || isImporting}
                  onClick={() => executeImport()}
                >
                  <ListChecks size={16} />
                  <span>{isImporting ? "検証中..." : "インポート実行 (モック)"}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={!hasSelection || isImporting}
                  onClick={handleRetry}
                >
                  <Repeat2 size={16} />
                  <span>再アップロード</span>
                </Button>
              </div>
            </div>
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
      {importResult && (
        <ImportResult
          result={importResult}
          open={showResult}
          onClose={() => setShowResult(false)}
          onRetry={handleRetry}
          onDownloadFailures={downloadFailures}
        />
      )}
    </div>
  );
}
