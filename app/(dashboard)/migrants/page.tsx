"use client";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { migrants } from "@/lib/mockData";
import { CalendarClock, Filter, Search, User } from "lucide-react";

export default function MigrantsPage() {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState("all");
  const filtered = useMemo(
    () =>
      migrants.filter(
        (m) =>
          (m.name.toLowerCase().includes(query.toLowerCase()) || m.company.toLowerCase().includes(query.toLowerCase())) &&
          (phase === "all" || m.phase === phase)
      ),
    [query, phase]
  );
  const phases = Array.from(new Set(migrants.map((m) => m.phase)));
  const detail = filtered[0];

  return (
    <div className="grid lg:grid-cols-[1.3fr_1fr] gap-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>入国者一覧</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-surface/60">
              <Search size={14} className="text-muted" />
              <input
                placeholder="氏名・実習先で検索"
                className="bg-transparent text-sm outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-surface/60">
              <Filter size={14} className="text-muted" />
              <select value={phase} onChange={(e) => setPhase(e.target.value)} className="bg-transparent text-sm outline-none">
                <option value="all">フェーズ指定なし</option>
                {phases.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {filtered.map((m) => (
            <div key={m.id} className="p-3 rounded-lg border border-border bg-surface/70 hover:border-brand-blue/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-surface border border-brand-blue/40">
                    <User className="text-brand-blue" size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{m.name}</p>
                    <p className="text-xs text-muted">{m.company}</p>
                  </div>
                </div>
                <Badge className="border-brand-blue text-brand-blue">{m.status}</Badge>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2 text-xs text-muted">
                <p>進捗: {m.completion}%</p>
                <p>リスク: {m.riskScore}</p>
                <div className="flex items-center gap-1">
                  <CalendarClock size={12} className="text-brand-amber" />
                  <span>期限 {m.visaExpireDate}</span>
                </div>
                <Badge className={m.riskScore > 30 ? "border-rose-300 text-rose-200" : "border-brand-amber text-brand-amber"}>{m.phase}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {detail && (
        <Card className="space-y-3">
          <CardHeader>
            <CardTitle>詳細 / 対応履歴</CardTitle>
            <p className="text-sm text-muted">編集ボタンやメモ欄はデモ用です</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded border border-border bg-surface/70">
                <p className="text-muted text-xs">氏名</p>
                <p>{detail.name}</p>
              </div>
              <div className="p-3 rounded border border-border bg-surface/70">
                <p className="text-muted text-xs">在留期限</p>
                <p>{detail.visaExpireDate}</p>
              </div>
              <div className="p-3 rounded border border-border bg-surface/70">
                <p className="text-muted text-xs">ステータス</p>
                <p>{detail.status}</p>
              </div>
              <div className="p-3 rounded border border-border bg-surface/70">
                <p className="text-muted text-xs">フェーズ</p>
                <p>{detail.phase}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">対応履歴（メモ）</p>
              <textarea rows={4} className="w-full" placeholder="例: VIZA更新に必要な追加資料を送付済み。AI補足コメントをここに追加可能。"></textarea>
              <div className="flex justify-end gap-2">
                <button className="btn-ghost px-3 py-2 rounded-lg">編集（デモ）</button>
                <button className="btn-primary px-4 py-2 rounded-lg">メモを追記（デモ）</button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
