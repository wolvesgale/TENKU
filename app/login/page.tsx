"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/components/providers/app-state-provider";
import { Sparkles } from "lucide-react";
import { Suspense } from "react";

const DEMO_EMAIL = process.env.NEXT_PUBLIC_TENKU_DEMO_EMAIL ?? "";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTenantCode, setTenantId, setTenantName, setEmail, setRole, setTenantType } = useAppState();
  const [tenantCode, updateTenantCode] = useState("");
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

      const data = await res.json();
      setTenantCode(tenantCode);
      setEmail(email);
      setTenantId(data.tenantId);
      setTenantName(data.tenantName);
      setRole(data.role);
      setTenantType(data.tenantType);

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
            <p className="text-sm text-muted">団体コード・ID・パスワードを入力</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm">団体コード</label>
            <input
              value={tenantCode}
              onChange={(e) => updateTenantCode(e.target.value)}
              placeholder="例: 240224"
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface/60 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm">ID（メール）</label>
            <input
              value={email}
              onChange={(e) => updateEmail(e.target.value)}
              type="email"
              required
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface/60 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm">パスワード</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface/60 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
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
