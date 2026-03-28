import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DEMO_TENANT = process.env.NEXT_PUBLIC_TENKU_TENANT_CODE ?? "240224";
const DEMO_EMAIL = process.env.NEXT_PUBLIC_TENKU_DEMO_EMAIL ?? "support@techtas.jp";
// パスワードはサーバー側専用（NEXT_PUBLIC_ を使わない）
const DEMO_PASSWORD = process.env.TENKU_DEMO_PASSWORD ?? process.env.NEXT_PUBLIC_TENKU_DEMO_PASSWORD ?? "techtas720";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { tenantCode, email, password } = body as Record<string, string>;

  if (tenantCode !== DEMO_TENANT || email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return NextResponse.json({ error: "認証情報が一致しません" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("tenku_session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8時間
  });

  return NextResponse.json({ ok: true });
}
