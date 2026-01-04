"use client";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { companies } from "@/lib/mockData";
import { Search } from "lucide-react";

export default function CompaniesPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(companies[0]?.id ?? null);

  const filtered = useMemo(
    () => companies.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.location.includes(query)),
    [query]
  );
  const detail = filtered.find((c) => c.id === selected) ?? filtered[0];

  return (
    <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>実習実施先</CardTitle>
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2">
            <Search size={14} className="text-muted" />
            <input
              placeholder="社名・所在地で検索"
              className="bg-transparent text-sm outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          {filtered.map((company) => (
            <button
              key={company.id}
              onClick={() => setSelected(company.id)}
              className={`text-left p-4 rounded-lg border transition ${selected === company.id ? "border-brand-blue bg-brand-blue/5 shadow-glow" : "border-border bg-surface/60 hover:border-brand-blue/60"}`}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">{company.name}</p>
                <Badge className="border-brand-blue text-brand-blue">{company.sector}</Badge>
              </div>
              <p className="text-xs text-muted">{company.location}</p>
              <div className="mt-3 space-y-1 text-xs">
                <p>受入人数: {company.trainees}名</p>
                <p>完成度: {company.completion}%</p>
                <p>リスクスコア: {company.riskScore}</p>
                <p>次回監査: {company.nextAudit}</p>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {detail && (
        <Card className="space-y-3">
          <CardHeader>
            <CardTitle>詳細 / 対応履歴</CardTitle>
            <p className="text-sm text-muted">{detail.name}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded border border-border bg-surface/70">
                <p className="text-muted text-xs">所在地</p>
                <p>{detail.location}</p>
              </div>
              <div className="p-3 rounded border border-border bg-surface/70">
                <p className="text-muted text-xs">次回監査</p>
                <p>{detail.nextAudit}</p>
              </div>
              <div className="p-3 rounded border border-border bg-surface/70">
                <p className="text-muted text-xs">完成度</p>
                <p>{detail.completion}%</p>
              </div>
              <div className="p-3 rounded border border-border bg-surface/70">
                <p className="text-muted text-xs">リスク</p>
                <p className={detail.riskScore > 25 ? "text-rose-300" : "text-emerald-300"}>{detail.riskScore} pts</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">対応履歴（メモ）</p>
              <textarea rows={4} className="w-full" placeholder="例: 監査予約を9/10に調整済み。改善計画ドラフトを待ち。"></textarea>
              <div className="flex justify-end">
                <button className="btn-primary px-4 py-2 rounded-lg">メモを追記 (デモ)</button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
