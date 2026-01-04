"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ganttSchedule } from "@/lib/mockData";
import { AlertTriangle } from "lucide-react";

const palette = {
  high: "from-rose-400/70 to-rose-500/40",
  medium: "from-brand-amber/70 to-brand-amber/30",
  low: "from-brand-teal/70 to-brand-blue/40",
};

export default function SchedulePage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>スケジュール (ガント風)</CardTitle>
          <Badge className="border-brand-blue text-brand-blue">期限 + アラート</Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          {ganttSchedule.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[200px_1fr_120px] gap-3 items-center text-sm py-3 px-2 rounded-lg border border-border bg-surface/60"
            >
              <div className="flex flex-col">
                <span className="text-white font-semibold">{item.title}</span>
                <span className="text-[11px] text-muted">レーン {item.lane}</span>
              </div>
              <div className="h-4 rounded-full bg-surface border border-border relative overflow-hidden">
                <div className={`absolute left-0 top-0 h-full w-2/5 bg-gradient-to-r ${palette[item.severity as keyof typeof palette] || palette.medium}`} />
              </div>
              <div className="flex items-center justify-end gap-2">
                <Badge className="border-brand-amber text-brand-amber">{item.end}</Badge>
                {item.severity !== "low" && (
                  <Badge className="border-rose-300 text-rose-200 flex items-center gap-1">
                    <AlertTriangle size={12} /> 期限接近
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
