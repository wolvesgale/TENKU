import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware: テナントIDをcookieからAPIリクエストヘッダーに注入
 *
 * cookie: tenku_tenant=tenant_xxx
 *   → x-tenant-id: tenant_xxx ヘッダーをAPI routeに渡す
 *
 * cookieがない場合は "tenant_demo" をデフォルトとして使用
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
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
  matcher: "/api/:path*",
};
