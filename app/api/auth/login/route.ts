import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DEMO_TENANT = process.env.NEXT_PUBLIC_TENKU_TENANT_CODE ?? "240224";

// テナント内の登録ユーザー一覧
const TENANT_USERS: Array<{ email: string; password: string }> = [
  {
    email: process.env.NEXT_PUBLIC_TENKU_DEMO_EMAIL ?? "support@techtas.jp",
    password: process.env.TENKU_DEMO_PASSWORD ?? process.env.NEXT_PUBLIC_TENKU_DEMO_PASSWORD ?? "techtas720",
  },
  {
    email: "horikane@yoshizumi.com",
    password: process.env.TENKU_CHC_PASSWORD ?? "chc1234",
  },
];

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { tenantCode, email, password } = body as Record<string, string>;

  const matched = tenantCode === DEMO_TENANT &&
    TENANT_USERS.some((u) => u.email === email && u.password === password);

  if (!matched) {
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
