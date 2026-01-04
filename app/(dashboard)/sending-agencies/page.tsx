"use client";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sendingAgencies } from "@/lib/mockData";
import { Globe2, Search, Users } from "lucide-react";

export default function SendingAgenciesPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      sendingAgencies.filter(
        (s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.country.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );
  const detail = filtered[0];

  return (
    <div className="grid lg:grid-cols-[1.3fr_1fr] gap-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>送出機関</CardTitle>
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-surface/60">
            <Search size={14} className="text-muted" />
            <input
              placeholder="名称・国で検索"
              className="bg-transparent text-sm outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          {filtered.map((s) => (
            <div key={s.id} className="p-3 rounded-lg border border-border bg-surface/70 hover:border-brand-blue/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg border border-brand-blue/40 bg-surface">
                    <Globe2 size={16} className="text-brand-blue" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{s.name}</p>
                    <p className="text-xs text-muted">国: {s.country}</p>
                  </div>
                </div>
                <Badge className="border-brand-amber text-brand-amber flex items-center gap-1">
                  <Users size={12} />
                  {s.migrants} 名
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted mt-2">
                <p>完成度: {s.completion}%</p>
                <p className={s.riskScore > 20 ? "text-rose-300" : "text-emerald-300"}>リスク: {s.riskScore}</p>
                <p>担当: {s.contact}</p>
                <p>ID: {s.id}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {detail && (
        <Card className="space-y-3">
          <CardHeader>
            <CardTitle>詳細 / 対応履歴</CardTitle>
            <p className="text-sm text-muted">{detail.name}</p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded border border-border bg-surface/70">
                <p className="text-muted text-xs">国</p>
                <p>{detail.country}</p>
              </div>
              <div className="p-3 rounded border border-border bg-surface/70">
                <p className="text-muted text-xs">担当者</p>
                <p>{detail.contact}</p>
              </div>
              <div className="p-3 rounded border border-border bg-surface/70">
                <p className="text-muted text-xs">完成度</p>
                <p>{detail.completion}%</p>
              </div>
              <div className="p-3 rounded border border-border bg-surface/70">
                <p className="text-muted text-xs">リスクスコア</p>
                <p>{detail.riskScore}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">対応履歴（メモ）</p>
              <textarea rows={4} className="w-full" placeholder="例: JITCO提出書式の差分確認を完了。オンライン面談の調整待ち。"></textarea>
              <div className="flex justify-end">
                <button className="btn-primary px-4 py-2 rounded-lg">メモを追記（デモ）</button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
