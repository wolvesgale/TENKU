"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/components/providers/app-state-provider";
import { Shield, Sparkles } from "lucide-react";
import { Suspense } from "react";

const DEMO_TENANT = process.env.NEXT_PUBLIC_TENKU_TENANT_CODE ?? "240224";
const DEMO_EMAIL = process.env.NEXT_PUBLIC_TENKU_DEMO_EMAIL ?? "";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTenantCode, setEmail, setRole, role } = useAppState();
  const [tenantCode, updateTenantCode] = useState(DEMO_TENANT);
  const [email, updateEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantCode, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "認証に失敗しました");
        return;
      }

      setTenantCode(tenantCode);
      setEmail(email);
      const from = searchParams.get("from") ?? "/dashboard";
      router.push(from);
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
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
          <Button type="submit" className="w-full" disabled={loading}>
            <Sparkles size={16} /> {loading ? "認証中..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
