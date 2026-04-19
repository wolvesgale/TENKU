"use client";
import { useEffect, useState } from "react";
import { useAppState } from "@/components/providers/app-state-provider";
import { Building2, Users, Link2, Bell, Shield, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type OrgProfile = { name?: string; permitNumber?: string; address?: string; phone?: string; website?: string };

const INTEGRATIONS = [
  { name: "OTIT（外国人技能実習機構）", category: "申請・届出", status: "partial", note: "OTITフォームへのPDF出力対応済み" },
  { name: "Google Classroom API",      category: "教育",       status: "planned", note: "API鍵設定後に有効化" },
  { name: "Google Drive API",          category: "書類管理",   status: "planned", note: "API鍵設定後に有効化" },
  { name: "TRP（旅行代理店）",          category: "航空券",     status: "planned", note: "旅行代理店確認後に対応" },
  { name: "発車オーライネット",          category: "高速バス",   status: "link",    note: "外部リンク誘導で対応済み" },
  { name: "入管（在留申請オンライン）",  category: "在留申請",   status: "planned", note: "入管APIは2025年より試験運用" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; Icon: any }> = {
  partial: { label: "部分対応", color: "border-brand-blue text-brand-blue",    Icon: CheckCircle },
  link:    { label: "リンクのみ", color: "border-emerald-400 text-emerald-300", Icon: Link2 },
  planned: { label: "計画中",   color: "border-brand-amber text-brand-amber",  Icon: Clock },
};

export default function SettingsPage() {
  const { email, tenantCode } = useAppState();
  const [org, setOrg] = useState<OrgProfile | null>(null);

  useEffect(() => {
    fetch("/api/v1/organization").then((r) => r.json()).then((res) => setOrg(res.data));
  }, []);

  return (
    <div className="space-y-6 p-4 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold">設定・連携</h1>
        <p className="text-sm text-muted">テナント情報・API連携状況の確認</p>
      </div>

      {/* テナント情報 */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-teal border-b border-border pb-1 flex items-center gap-2"><Building2 size={14} />テナント情報</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "組合名",       value: org?.name },
            { label: "許可番号",     value: org?.permitNumber },
            { label: "所在地",       value: org?.address },
            { label: "電話番号",     value: org?.phone },
            { label: "WEBサイト",    value: org?.website },
            { label: "テナントコード", value: tenantCode },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-lg border border-border bg-surface/60">
              <p className="text-[10px] uppercase tracking-wide text-muted mb-1">{label}</p>
              <p className="text-sm text-white">{value || "―"}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted">組合情報の変更は <a href="/organization" className="text-brand-blue hover:underline">組織管理ページ</a> から行ってください。</p>
      </section>

      {/* ユーザー情報 */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-teal border-b border-border pb-1 flex items-center gap-2"><Users size={14} />ログイン情報</h2>
        <div className="p-3 rounded-lg border border-border bg-surface/60 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted mb-1">ログイン中のアカウント</p>
            <p className="text-sm text-white">{email || "―"}</p>
          </div>
          <a href="/api/auth/logout" className="text-xs text-rose-400 hover:underline">ログアウト</a>
        </div>
      </section>

      {/* 外部連携 */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-teal border-b border-border pb-1 flex items-center gap-2"><Link2 size={14} />外部連携ステータス</h2>
        <div className="space-y-2">
          {INTEGRATIONS.map((item) => {
            const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.planned;
            return (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface/60 gap-3 flex-wrap">
                <div>
                  <p className="text-sm text-white">{item.name}</p>
                  <p className="text-xs text-muted">{item.category}　/　{item.note}</p>
                </div>
                <Badge className={`${cfg.color} text-[10px] flex items-center gap-1`}>
                  <cfg.Icon size={10} />{cfg.label}
                </Badge>
              </div>
            );
          })}
        </div>
      </section>

      {/* フィールドマッピング概要 */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-teal border-b border-border pb-1 flex items-center gap-2"><Shield size={14} />書式出力マッピング</h2>
        <div className="p-4 rounded-lg border border-border bg-surface/60 text-xs text-muted space-y-2">
          <p className="text-white text-sm font-medium">シングルDB × 書式マッピング方式</p>
          <p>外国人・企業・組合の情報は単一DBに保存し、書式ごとのフィールド対応表（field-map.ts）によって各公的書類に自動出力する設計です。</p>
          <div className="grid gap-2 mt-2">
            {[
              { form: "OTIT技能実習計画", status: "対応済み" },
              { form: "在留資格変更許可申請書", status: "対応予定" },
              { form: "在留期間更新許可申請書", status: "対応予定" },
              { form: "1号支援計画書", status: "対応予定" },
              { form: "外国人雇用状況届出（ハローワーク）", status: "対応予定" },
            ].map((row) => (
              <div key={row.form} className="flex justify-between">
                <span>{row.form}</span>
                <span className={row.status === "対応済み" ? "text-emerald-400" : "text-brand-amber"}>{row.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
