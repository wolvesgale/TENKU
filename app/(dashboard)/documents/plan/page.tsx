"use client";
import { useMemo, useState } from "react";
import { documents, tasks } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Download, Clock, ShieldAlert } from "lucide-react";

export default function PlanDocumentsPage() {
  const [message, setMessage] = useState("");
  const list = useMemo(() => documents.filter((d) => d.type === "plan"), []);
  const reminders = useMemo(() => tasks.filter((t) => t.relatedEntity.includes("plan")), []);

  const handleAction = (action: string, name: string) => {
    setMessage(`${action} : ${name} を処理しました（デモ）`);
    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>計画認定書類</CardTitle>
          <Badge className="border-brand-blue text-brand-blue flex items-center gap-1">
            <Sparkles size={14} />
            HUD view
          </Badge>
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
                  <Badge className="border-brand-amber text-brand-amber">{doc.status}</Badge>
                  <Badge className={doc.riskScore > 25 ? "border-rose-300 text-rose-200" : "border-emerald-400 text-emerald-300"}>
                    リスク {doc.riskScore}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted mt-2">
                <span>完成度 {doc.completion}%</span>
                <span className="text-brand-blue">owner {doc.owner}</span>
                <span className="flex items-center gap-1 text-brand-amber">
                  <ShieldAlert size={12} />
                  SLA {doc.deadline}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button size="sm" onClick={() => handleAction("複製", doc.name)}>
                  <Copy size={14} /> 前回複製
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleAction("出力", doc.name)}>
                  <Download size={14} /> 出力
                </Button>
              </div>
            </div>
          ))}
          {message && <p className="text-xs text-brand-blue mt-2">{message}</p>}
        </CardContent>
      </Card>

      <Card className="space-y-3">
        <CardHeader>
          <CardTitle>スケジュール連動</CardTitle>
          <p className="text-sm text-muted">期限接近をダッシュボードと同期</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {reminders.map((task) => (
            <div key={task.id} className="p-3 rounded-lg border border-border bg-surface/70 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white text-sm">{task.title}</p>
                <p className="text-xs text-muted">関連ID: {task.relatedEntity}</p>
              </div>
              <Badge className="border-brand-amber text-brand-amber flex items-center gap-1">
                <Clock size={12} />
                {task.dueDate}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
