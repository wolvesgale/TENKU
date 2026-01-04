"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { documents } from "@/lib/mockData";
import { ArrowRight } from "lucide-react";

const groups = [
  { href: "/documents/plan", label: "計画認定書類", type: "plan" },
  { href: "/documents/procedures", label: "各種手続書類", type: "procedures" },
  { href: "/documents/audit", label: "監査・報告", type: "audit" },
];

export default function DocumentsPage() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {groups.map((group) => {
        const items = documents.filter((d) => d.type === group.type);
        const avg = Math.round(items.reduce((sum, d) => sum + d.completion, 0) / items.length);
        return (
          <Card key={group.href} className="relative overflow-hidden">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue/70 to-transparent" />
            <CardHeader>
              <CardTitle>{group.label}</CardTitle>
              <p className="text-sm text-muted">件数 {items.length} / 平均完成度 {avg}%</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                {items.slice(0, 3).map((d) => (
                  <div key={d.id} className="p-2 rounded border border-border bg-surface/70">
                    <p className="font-semibold text-white">{d.name}</p>
                    <p className="text-xs text-muted">最終更新 {d.lastUpdated}</p>
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <Badge className="border-brand-blue text-brand-blue">{d.status}</Badge>
                      <span>完成度 {d.completion}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href={group.href}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-brand-blue text-brand-blue hover:bg-brand-blue/10"
              >
                詳細を見る <ArrowRight size={14} />
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
