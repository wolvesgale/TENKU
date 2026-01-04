"use client";
import { useState } from "react";
import { templateMonitors } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Diff, Globe2, RefreshCcw } from "lucide-react";

export default function TemplateMonitorPage() {
  const [message, setMessage] = useState("");

  const handleDiff = (name: string) => {
    setMessage(`${name} の差分チェックを実行 (モック)`);
    setTimeout(() => setMessage(""), 2200);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>行政書式の更新検知</CardTitle>
          <Badge className="border-brand-blue text-brand-blue">テスト環境</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {templateMonitors.map((tmpl) => (
            <div key={tmpl.id} className="p-4 rounded-lg border border-border bg-surface/70 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe2 size={16} className="text-brand-blue" />
                  <div>
                    <p className="font-semibold text-white">{tmpl.name}</p>
                    <p className="text-xs text-muted">{tmpl.url}</p>
                  </div>
                </div>
                <Badge className={tmpl.hasDiff ? "border-rose-300 text-rose-200" : "border-emerald-400 text-emerald-300"}>
                  {tmpl.hasDiff ? "変更あり" : "変更なし"}
                </Badge>
              </div>
              <p className="text-xs text-muted">最新ハッシュ: {tmpl.lastHash}</p>
              <div className="p-3 rounded-lg border border-border bg-surface">
                <p className="text-xs text-brand-blue">変更点の要約 (AI)</p>
                <p className="text-sm text-white">{tmpl.aiSummary}</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-surface">
                <p className="text-xs text-brand-blue">テンプレ更新案</p>
                <p className="text-sm text-white">{tmpl.proposal}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleDiff(tmpl.name)}>
                  <RefreshCcw size={14} /> 差分チェック
                </Button>
                <Button size="sm" variant="ghost">
                  <Diff size={14} /> ハッシュ比較
                </Button>
              </div>
            </div>
          ))}
          {message && <p className="text-xs text-brand-blue">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
