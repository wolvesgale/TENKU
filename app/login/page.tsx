"use client";

import { FormEvent, useState } from "react";
import { useAuth, UserRole } from "@/components/providers/AuthProvider";
import { ShieldCheck, Sparkles } from "lucide-react";

const roles: { value: UserRole; label: string }[] = [
  { value: "tenantAdmin", label: "Tenant Admin" },
  { value: "tenantStaff", label: "Tenant Staff" },
  { value: "migrantUser", label: "Migrant User" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [tenantCode, setTenantCode] = useState("T-739102");
  const [email, setEmail] = useState("demo@tenku.cloud");
  const [password, setPassword] = useState("tenku-demo42");
  const [role, setRole] = useState<UserRole>("tenantAdmin");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await login({ email, password, tenantCode, role });
    if (!ok) {
      setError("ログインに失敗しました。デモ用固定値をご確認ください。");
    }
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl w-full">
        <div className="glass-panel p-8 border border-slate-800/70 shadow-neon">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-brand-teal/30 to-brand-blue/20 border border-brand-blue/40">
              <ShieldCheck className="text-brand-teal" />
            </div>
            <div>
              <p className="text-sm muted">Operations Cloud</p>
              <h1 className="text-2xl font-bold text-white">TENKU デモ環境</h1>
              <p className="text-sm text-slate-400">監理・申請・請求をモダンUIで統合。将来のAI活用を想定したデモです。</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm text-slate-300">管理団体コード</label>
              <input
                className="mt-1 w-full rounded-lg bg-slate-900/60 border border-slate-700 px-3 py-2 focus:border-brand-blue/80 focus:outline-none"
                value={tenantCode}
                onChange={(e) => setTenantCode(e.target.value)}
                placeholder="例: 240224"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">メールアドレス</label>
              <input
                className="mt-1 w-full rounded-lg bg-slate-900/60 border border-slate-700 px-3 py-2 focus:border-brand-blue/80 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="support@techtas.jp"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">パスワード</label>
              <input
                type="password"
                className="mt-1 w-full rounded-lg bg-slate-900/60 border border-slate-700 px-3 py-2 focus:border-brand-blue/80 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">ユーザー種別</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                      role === r.value
                        ? "border-brand-blue/80 bg-brand-blue/10 text-white"
                        : "border-slate-700 bg-slate-900/40 text-slate-300 hover:border-brand-blue/60"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">※ RBAC拡張を見据えたデモ選択肢</p>
            </div>

            {error && <p className="text-rose-400 text-sm">{error}</p>}

            <button type="submit" className="btn-primary w-full py-3" disabled={isSubmitting}>
              {isSubmitting ? "検証中..." : "ログイン"}
            </button>
          </form>

          <div className="mt-6 text-xs text-slate-400 space-y-1">
            <p>デモ用固定値：tenantCode=T-739102 / email=demo@tenku.cloud / password=tenku-demo42</p>
            <p>入力内容は保存されません。本番環境ではIDプロバイダ連携を想定しています。</p>
          </div>
        </div>

        <div className="glass-panel p-8 border border-brand-blue/30">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-brand-blue" />
            <div>
              <p className="text-sm muted">TENKU UI + AI</p>
              <h2 className="text-xl font-semibold">ネオンHUDスタイルで主要機能を体験</h2>
            </div>
          </div>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="badge border-brand-blue/70 text-brand-blue">KPI</span>
              <p>ダッシュボードで入国者数・監理先・書類ステータスを一目で確認。</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="badge border-brand-teal/70 text-brand-teal">AI</span>
              <p>期限が近いタスクや不足項目をチャットで提案。将来はOpenAI API差替え可。</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="badge border-brand-violet/70 text-brand-violet">Ops</span>
              <p>マスタ管理、書類、請求、CSV連携、ガント風スケジュールをメニューで網羅。</p>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
