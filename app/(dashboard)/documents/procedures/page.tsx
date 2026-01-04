"use client";
import { useMemo, useState } from "react";
import { documents, tasks } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Timer, ShieldCheck } from "lucide-react";

export default function ProcedureDocumentsPage() {
  const [message, setMessage] = useState("");
  const list = useMemo(() => documents.filter((d) => d.type === "procedures"), []);
  const schedule = useMemo(() => tasks.filter((t) => t.relatedEntity.includes("procedures")), []);

  const handleAction = (action: string, name: string) => {
    setMessage(`${action}: ${name} (デモ動作)`);
    setTimeout(() => setMessage(""), 2400);
  };

  return (
    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>各種手続書類</CardTitle>
          <Badge className="border-brand-blue text-brand-blue">一括出力</Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          {list.map((doc) => (
            <div key={doc.id} className="p-4 rounded-lg border border-border bg-surface/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{doc.name}</p>
                  <p className="text-xs text-muted">最終更新: {doc.lastUpdated} / 期限 {doc.deadline}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={doc.completion > 80 ? "border-emerald-400 text-emerald-300" : "border-brand-amber text-brand-amber"}>
                    {doc.status}
                  </Badge>
                  <Badge className={doc.riskScore > 24 ? "border-rose-300 text-rose-200" : "border-emerald-400 text-emerald-300"}>
                    リスク {doc.riskScore}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center flex-wrap gap-2 text-xs text-muted mt-1">
                <span>完成度 {doc.completion}%</span>
                <span className="text-brand-blue">owner {doc.owner}</span>
                <span className="flex items-center gap-1 text-brand-amber">
                  <ShieldCheck size={12} />
                  締切 {doc.deadline}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button size="sm" onClick={() => handleAction("前月複製", doc.name)}>
                  <Copy size={14} /> 前月複製
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleAction("出力", doc.name)}>
                  <Download size={14} /> 出力
                </Button>
              </div>
            </div>
          ))}
          {message && <p className="text-xs text-brand-blue">{message}</p>}
        </CardContent>
      </Card>

      <Card className="space-y-3">
        <CardHeader>
          <CardTitle>期限表示 (モック)</CardTitle>
          <p className="text-sm text-muted">スケジュール連動で期限を管理</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {schedule.length === 0 && <p className="text-sm text-muted">手続書類に紐づく期限はありません。</p>}
          {schedule.map((item) => (
            <div key={item.id} className="p-3 rounded-lg border border-border bg-surface/70 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white text-sm">{item.title}</p>
                <p className="text-xs text-muted">{item.relatedEntity}</p>
              </div>
              <Badge className="border-brand-amber text-brand-amber flex items-center gap-1">
                <Timer size={12} />
                {item.dueDate}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
