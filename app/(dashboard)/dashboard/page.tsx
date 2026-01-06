"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { dashboardDocuments, dashboardExternalLinks, dashboardKpiCards } from "@/lib/demo-dashboard-data";
import { Flame, Link2, Radar } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ReminderTask = {
  id: string;
  title?: string;
  taskType: string;
  status: "TODO" | "DOING" | "DONE" | string;
  dueDate?: string;
  severity?: "high" | "medium" | "low";
  relatedEntity?: string;
};

const statusBadgeClass = (status: ReminderTask["status"]) => {
  switch (status) {
    case "DOING":
      return "border-brand-blue text-brand-blue";
    case "TODO":
      return "border-brand-amber text-brand-amber";
    default:
      return "border-emerald-400 text-emerald-300";
  }
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<ReminderTask[]>([]);

  useEffect(() => {
    fetch("/api/v1/tasks")
      .then((r) => r.json())
      .then((res) => setTasks(res.data ?? []))
      .catch(() => setTasks([]));
  }, []);

  const reminders = useMemo(
    () =>
      [...tasks]
        .filter((t) => t.status !== "DONE")
        .sort((a, b) => new Date(a.dueDate || "").getTime() - new Date(b.dueDate || "").getTime())
        .slice(0, 5),
    [tasks],
  );
  const docSummary = useMemo(
    () =>
      dashboardDocuments.map((d) => ({
        ...d,
        urgency: d.completion < 60 || d.riskScore > 28 ? "high" : d.completion < 80 || d.riskScore > 22 ? "medium" : "low",
      })),
    [],
  );

  return (
    <div className="grid gap-4">
      <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-4">
        {dashboardKpiCards.map((kpi) => (
          <Card key={kpi.title} className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-transparent to-brand-amber/10 pointer-events-none" />
            <CardHeader>
              <CardDescription>{kpi.title}</CardDescription>
              <CardTitle className="text-3xl">{kpi.value.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${kpi.trend === "up" ? "text-emerald-300" : "text-rose-300"}`}>{kpi.change} vs last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>リマインダー</CardTitle>
              <CardDescription>期限が近いタスクを集中表示</CardDescription>
            </div>
            <Badge className="border-brand-amber text-brand-amber flex items-center gap-1">
              <Flame size={14} />
              High Priority
            </Badge>
          </CardHeader>
            <CardContent>
              <Table>
                <THead>
                  <TR>
                    <TH>タスク</TH>
                  <TH>期限</TH>
                  <TH>状態</TH>
                  <TH>関連</TH>
                </TR>
              </THead>
              <TBody>
                {reminders.map((task) => (
                  <TR key={task.id}>
                    <TD>{task.title ?? task.taskType}</TD>
                    <TD>{formatDate(task.dueDate)}</TD>
                    <TD>
                      <Badge className={statusBadgeClass(task.status)}>{task.status}</Badge>
                    </TD>
                    <TD>{task.relatedEntity}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>お知らせ + 外部リンク</CardTitle>
            <CardDescription>OTIT / JITCO などの定常導線</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border border-border bg-surface/60">
              <p className="text-sm font-semibold text-white">今月の重点</p>
              <p className="text-xs text-muted">監査・計画認定の締切が集中しています。手続き書類の一括出力を推奨。</p>
            </div>
            <div className="space-y-2">
              {dashboardExternalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-border hover:border-brand-blue"
                >
                  <div className="flex items-center gap-2">
                    <Link2 size={16} className="text-brand-blue" />
                    <span>{link.name}</span>
                  </div>
                  <span className="text-xs text-muted">open</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>書類の進捗とリスク</CardTitle>
            <CardDescription>完成度とリスクをHUD風に表示</CardDescription>
          </div>
          <Badge className="border-brand-blue text-brand-blue flex items-center gap-1">
            <Radar size={14} />
            Monitor
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            {docSummary.map((doc) => (
              <div key={doc.id} className="p-3 rounded-lg border border-border bg-surface/70 space-y-2">
                <p className="text-sm font-semibold text-white">{doc.name}</p>
                <p className="text-xs text-muted">更新: {doc.lastUpdated}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="border-brand-blue text-brand-blue">{doc.type}</Badge>
                  <Badge className={doc.urgency === "high" ? "border-rose-300 text-rose-200" : doc.urgency === "medium" ? "border-brand-amber text-brand-amber" : "border-emerald-400 text-emerald-300"}>
                    {doc.status}
                  </Badge>
                  <Badge className={doc.riskScore > 25 ? "border-rose-300 text-rose-200" : "border-emerald-400 text-emerald-300"}>
                    リスク {doc.riskScore}
                  </Badge>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className={`h-full ${doc.completion >= 80 ? "bg-emerald-400" : doc.completion >= 60 ? "bg-brand-amber" : "bg-rose-400"}`}
                    style={{ width: `${doc.completion}%` }}
                  />
                </div>
                <p className="text-xs text-muted">完成度 {doc.completion}% / Owner {doc.owner} / 期限 {doc.deadline}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
