"use client";
import { ExternalLink, Bus, Info } from "lucide-react";

const COMMON_ROUTES = [
  { from: "丹波市（春日）", to: "大阪（梅田）", provider: "全但バス", note: "所要約2時間" },
  { from: "丹波市（柏原）", to: "神戸（三宮）", provider: "全但バス", note: "所要約1時間30分" },
  { from: "篠山市", to: "大阪（梅田）", provider: "神姫バス", note: "所要約1時間30分" },
];

export default function TravelBusPage() {
  return (
    <div className="space-y-4 p-4 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold">国内移動（高速バス）</h1>
        <p className="text-sm text-muted">高速バスの検索・予約は発車オーライネットで行います</p>
      </div>

      {/* メインリンクカード */}
      <div className="rounded-xl border border-brand-blue/30 bg-brand-blue/5 p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-blue/20 flex items-center justify-center">
            <Bus size={20} className="text-brand-blue" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">発車オーライネット</p>
            <p className="text-xs text-muted">高速バス予約サイト（外部）</p>
          </div>
        </div>
        <a
          href="https://www.j-bus.co.jp/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue text-white text-sm hover:opacity-90 transition shrink-0"
        >
          <ExternalLink size={14} /> 検索・予約
        </a>
      </div>

      {/* よく使うルート */}
      <div className="rounded-xl border border-border bg-surface/60 overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Bus size={14} className="text-brand-teal" />
          <h2 className="text-sm font-semibold">よく使うルート（参考）</h2>
        </div>
        <div className="divide-y divide-border">
          {COMMON_ROUTES.map((r, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 gap-4 flex-wrap">
              <div>
                <p className="text-sm text-white">{r.from} → {r.to}</p>
                <p className="text-xs text-muted">{r.provider} / {r.note}</p>
              </div>
              <a
                href={`https://www.j-bus.co.jp/`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-blue hover:underline flex items-center gap-1"
              >
                <ExternalLink size={11} /> 検索
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 使い方メモ */}
      <div className="flex gap-3 p-4 rounded-xl border border-border bg-surface/60">
        <Info size={16} className="text-muted shrink-0 mt-0.5" />
        <div className="text-xs text-muted space-y-1">
          <p>予約後、URLをコピーして一時帰国管理の旅程に貼り付けて管理できます。</p>
          <p>パスポートの期限・在留カードの有効期限は出発前に必ず確認してください。</p>
        </div>
      </div>
    </div>
  );
}
