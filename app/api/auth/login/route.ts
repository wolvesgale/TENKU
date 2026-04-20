import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authenticateDemoTenant } from "@/lib/demo-store";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 8, // 8時間
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { tenantCode, email, password } = body as Record<string, string>;

  const account = authenticateDemoTenant(tenantCode ?? "", email ?? "", password ?? "");

  if (!account) {
    return NextResponse.json({ error: "認証情報が一致しません" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("tenku_session", "authenticated", COOKIE_OPTIONS);
  cookieStore.set("tenku_tenant", account.tenantId, COOKIE_OPTIONS);

  return NextResponse.json({
    ok: true,
    tenantId: account.tenantId,
    tenantName: account.name,
    tenantType: account.tenantType,
    role: account.role,
  });
}
