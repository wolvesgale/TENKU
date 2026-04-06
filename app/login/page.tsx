"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/components/providers/app-state-provider";
import { Shield, Sparkles, Building2, ChevronDown } from "lucide-react";

type DemoAccount = {
  tenantId: string;
  tenantCode: string;
  name: string;
  email: string;
  password: string;
  role: "tenantAdmin";
};

const DEMO_ACCOUNTS: DemoAccount[] = [
  { tenantId: "tenant_demo", tenantCode: "240224", name: "TENKU監理協同組合", email: "support@techtas.jp", password: "techtas720", role: "tenantAdmin" },
  { tenantId: "tenant_hikari", tenantCode: "360101", name: "ひかり監理組合", email: "info@hikari-kanri.jp", password: "hikari2024", role: "tenantAdmin" },
  { tenantId: "tenant_sunrise", tenantCode: "480502", name: "サンライズ協同組合", email: "demo@sunrise-coop.jp", password: "sunrise2024", role: "tenantAdmin" },
];

export default function LoginPage() {
  const router = useRouter();
  const { setTenantId, setTenantCode, setTenantName, setEmail, setRole } = useAppState();

  const [tenantCode, updateTenantCode] = useState("");
  const [email, updateEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showQuickSelect, setShowQuickSelect] = useState(false);

  const fillDemo = (account: DemoAccount) => {
    updateTenantCode(account.tenantCode);
    updateEmail(account.email);
    setPassword(account.password);
    setError(null);
    setShowQuickSelect(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const account = DEMO_ACCOUNTS.find(
      (a) => a.tenantCode === tenantCode && a.email === email && a.password === password
    );
    if (account) {
      // Set tenant cookie for middleware
      document.cookie = `tenku_tenant=${account.tenantId}; path=/; max-age=86400`;
      setTenantId(account.tenantId);
      setTenantCode(account.tenantCode);
      setTenantName(account.name);
      setEmail(account.email);
      setRole(account.role);
      setError(null);
      router.push("/dashboard");
    } else {
      setError("入力した情報が一致しません。デモアカウントをご確認ください。");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="glass-card max-w-md w-full p-8 space-y-6 shadow-glow">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center text-slate-900 font-bold">
            T
          </div>
          <div>
            <p className="text-sm text-muted">TENKU_Cloud</p>
            <h1 className="text-2xl font-bold text-white">ログイン</h1>
            <p className="text-sm text-muted">管理団体コード + ID + PW を入力</p>
          </div>
        </div>

        {/* Quick demo account selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowQuickSelect((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg border border-border bg-surface/60 text-gray-300 hover:bg-surface transition"
          >
            <span className="flex items-center gap-2">
              <Building2 size={14} className="text-brand-teal" />
              デモアカウントを選択（クイック入力）
            </span>
            <ChevronDown size={14} className={showQuickSelect ? "rotate-180" : ""} />
          </button>
          {showQuickSelect && (
            <div className="absolute z-10 mt-1 w-full bg-surface border border-border rounded-lg shadow-lg overflow-hidden">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.tenantId}
                  type="button"
                  onClick={() => fillDemo(a)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 transition border-b border-border last:border-0"
                >
                  <div className="text-sm font-medium text-white">{a.name}</div>
                  <div className="text-xs text-muted">コード: {a.tenantCode} / {a.email}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm">管理団体コード</label>
            <input
              value={tenantCode}
              onChange={(e) => updateTenantCode(e.target.value)}
              placeholder="例: 240224"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm">ID（メール）</label>
            <input
              value={email}
              onChange={(e) => updateEmail(e.target.value)}
              type="email"
              placeholder="例: support@techtas.jp"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm">パスワード</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="パスワードを入力"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm flex items-center gap-1 text-muted">
              <Shield size={14} /> ユーザー種別（将来のRBAC想定）
            </label>
            <select className="w-full" disabled>
              <option value="tenantAdmin">tenantAdmin</option>
            </select>
          </div>
          {error && <p className="text-rose-400 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            <Sparkles size={16} /> Sign in
          </Button>
        </form>

        <div className="text-xs text-muted border-t border-border pt-3 space-y-1">
          <div className="font-medium text-gray-400 mb-1">デモアカウント一覧：</div>
          {DEMO_ACCOUNTS.map((a) => (
            <div key={a.tenantId} className="flex gap-2">
              <span className="text-brand-teal w-32 truncate">{a.name}</span>
              <span>{a.tenantCode}</span>
              <span className="text-muted">/</span>
              <span>{a.email}</span>
              <span className="text-muted">/</span>
              <span>{a.password}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
