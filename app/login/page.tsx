"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const [email, setEmail] = useState("demo@tenku.cloud");
  const [password, setPassword] = useState("tenku-demo42");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();

  const callbackUrl = params.get("callbackUrl") || "/dashboard";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", { redirect: false, email, password, callbackUrl });
    if (res?.error) {
      setError("認証に失敗しました");
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="glass-card max-w-md w-full p-8 space-y-6">
        <div>
          <p className="text-sm text-muted">TENKU AI Agent</p>
          <h1 className="text-2xl font-bold text-white">Sign in</h1>
          <p className="text-sm text-muted">デモ用資格情報でログインしてください</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>
          {error && <p className="text-rose-400 text-sm">{error}</p>}
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
        <div className="text-xs text-muted">
          デモ用: email=demo@tenku.cloud / password=tenku-demo42
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-muted py-10">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
