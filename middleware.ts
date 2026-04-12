import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/auth/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 静的アセット・パブリックパスはスルー
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/pdf") ||
    pathname === "/favicon.ico" ||
    PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get("tenku_session");
  if (!session || session.value !== "authenticated") {
    // APIリクエストは 401 を返す
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // ページリクエストはログインへリダイレクト
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // テナントIDをcookieからAPIリクエストヘッダーに注入
  if (pathname.startsWith("/api/")) {
    const tenantId =
      request.cookies.get("tenku_tenant")?.value ?? "tenant_demo";
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-tenant-id", tenantId);
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
