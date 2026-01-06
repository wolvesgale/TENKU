"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, THead, TH, TR, TD } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  FileWarning,
  ListChecks,
  UploadCloud,
  X,
  XCircle,
} from "lucide-react";

export type ImportFailure = {
  line: number;
  recordId: string;
  reason: string;
};

export type ImportSuccess = {
  line: number;
  recordId: string;
  note?: string;
};

export type ImportResultData = {
  fileName: string;
  total: number;
  successCount: number;
  failureCount: number;
  failures: ImportFailure[];
  successes: ImportSuccess[];
};

type ImportResultProps = {
  result: ImportResultData;
  open?: boolean;
  onClose?: () => void;
  onRetry?: () => void;
  onDownloadFailures?: () => void;
  className?: string;
};

const summaryItems = (result: ImportResultData) => [
  {
    label: "総件数",
    value: result.total,
    tone: "text-white",
    icon: ListChecks,
    accent: "border-brand-blue/60 bg-brand-blue/10",
  },
  {
    label: "成功",
    value: result.successCount,
    tone: "text-emerald-200",
    icon: CheckCircle2,
    accent: "border-emerald-400/50 bg-emerald-400/10",
  },
  {
    label: "失敗",
    value: result.failureCount,
    tone: "text-brand-amber",
    icon: XCircle,
    accent: "border-brand-amber/50 bg-brand-amber/10",
  },
];

export function ImportResult({ result, open = true, onClose, onRetry, onDownloadFailures, className }: ImportResultProps) {
  const [showSuccesses, setShowSuccesses] = useState(false);
  const displayedFailures = useMemo(() => result.failures.slice(0, 50), [result.failures]);
  const hiddenFailures = result.failures.length - displayedFailures.length;
  const isOpen = open !== false;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className={cn("w-full max-w-5xl", className)}>
        <Card className="border border-border shadow-2xl bg-surface/90">
          <CardHeader className="flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs text-muted">{result.fileName} の結果</p>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ListChecks size={18} className="text-brand-blue" />
                CSVインポート結果
                <Badge className="border-brand-blue/60 text-brand-blue">検証済み</Badge>
              </CardTitle>
            </div>
            <div className="flex flex-wrap gap-2">
              {onRetry && (
                <Button variant="subtle" size="sm" onClick={onRetry} className="flex items-center gap-2">
                  <UploadCloud size={16} />
                  <span>再アップロード</span>
                </Button>
              )}
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose} className="flex items-center gap-2">
                  <X size={16} />
                  <span>閉じる</span>
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              {summaryItems(result).map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={cn(
                      "rounded-lg border p-3 shadow-inner",
                      item.accent,
                      "border-border/50 flex items-center justify-between"
                    )}
                  >
                    <div>
                      <p className="text-xs text-muted">{item.label}</p>
                      <p className={cn("text-2xl font-semibold", item.tone)}>{item.value}</p>
                    </div>
                    <Icon size={24} className="text-brand-blue" />
                  </div>
                );
              })}
            </div>

            <div className="rounded-lg border border-border bg-surface/80 p-3 shadow-inner">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 text-sm text-white">
                  <FileWarning size={18} className="text-brand-amber" />
                  <span>失敗リスト ({result.failureCount}件)</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted">
                  {hiddenFailures > 0 && <span className="text-amber-100">表示は最大50件まで ({hiddenFailures}件はCSVを参照)</span>}
                  {onDownloadFailures && (
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={onDownloadFailures}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} />
                      <span>失敗CSVをダウンロード</span>
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-3 overflow-auto">
                <Table className="w-full text-xs">
                  <THead>
                    <TR className="text-left text-muted">
                      <TH className="p-2">行番号</TH>
                      <TH className="p-2">レコードID</TH>
                      <TH className="p-2">エラー理由</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {displayedFailures.map((failure) => (
                      <TR key={`${failure.line}-${failure.recordId}`} className="border-t border-border/60 text-white">
                        <TD className="p-2 whitespace-nowrap">{failure.line}</TD>
                        <TD className="p-2 whitespace-nowrap">{failure.recordId}</TD>
                        <TD className="p-2 text-muted">{failure.reason}</TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface/60 p-3">
              <button
                type="button"
                onClick={() => setShowSuccesses((prev) => !prev)}
                className="flex w-full items-center justify-between text-left"
              >
                <div className="flex items-center gap-2 text-sm text-white">
                  {showSuccesses ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span>成功リスト (任意表示)</span>
                  <Badge className="border-emerald-300/40 text-emerald-200">{result.successCount}件</Badge>
                </div>
                <CheckCircle2 size={18} className="text-emerald-300" />
              </button>

              {showSuccesses && (
                <div className="mt-3 overflow-auto">
                  <Table className="w-full text-xs">
                    <THead>
                      <TR className="text-left text-muted">
                        <TH className="p-2">行番号</TH>
                        <TH className="p-2">レコードID</TH>
                        <TH className="p-2">備考</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {result.successes.map((success) => (
                        <TR key={`${success.line}-${success.recordId}`} className="border-t border-border/60 text-white">
                          <TD className="p-2 whitespace-nowrap">{success.line}</TD>
                          <TD className="p-2 whitespace-nowrap">{success.recordId}</TD>
                          <TD className="p-2 text-muted">{success.note ?? "-"}</TD>
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
