"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/components/providers/app-state-provider";
import { Shield, Sparkles } from "lucide-react";

const DEMO_TENANT = process.env.NEXT_PUBLIC_TENKU_TENANT_CODE ?? "240224";
const DEMO_EMAIL = process.env.NEXT_PUBLIC_TENKU_DEMO_EMAIL ?? "support@techtas.jp";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_TENKU_DEMO_PASSWORD ?? "techtas720";

export default function LoginPage() {
  const router = useRouter();
  const { setTenantCode, setEmail, setRole, role } = useAppState();
  const [tenantCode, updateTenantCode] = useState(DEMO_TENANT);
  const [email, updateEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tenantCode === DEMO_TENANT && email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setTenantCode(tenantCode);
      setEmail(email);
      setError(null);
      router.push("/dashboard");
    } else {
      setError("デモ用固定値と一致しません");
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
            <h1 className="text-2xl font-bold text-white">ダミーログイン</h1>
            <p className="text-sm text-muted">管理団体コード + ID + PW を入力</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm">管理団体コード</label>
            <input value={tenantCode} onChange={(e) => updateTenantCode(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm">ID（メール）</label>
            <input value={email} onChange={(e) => updateEmail(e.target.value)} type="email" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm">パスワード</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm flex items-center gap-1 text-muted">
              <Shield size={14} /> ユーザー種別（将来のRBAC想定）
            </label>
            <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full">
              <option value="tenantAdmin">tenantAdmin</option>
              <option value="tenantStaff">tenantStaff</option>
              <option value="migrantUser">migrantUser</option>
            </select>
          </div>
          {error && <p className="text-rose-400 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            <Sparkles size={16} /> Sign in (デモ)
          </Button>
        </form>
        <div className="text-xs text-muted">
          デモ用固定値: tenantCode={DEMO_TENANT}, email={DEMO_EMAIL}, password={DEMO_PASSWORD}
        </div>
      </div>
    </div>
  );
}
