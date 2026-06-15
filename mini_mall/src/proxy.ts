import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/** 需要登录才能访问的路由 */
const PROTECTED_ROUTES = ["/cart", "/checkout", "/orders"];
/** 需要管理员角色才能访问的路由 */
const ADMIN_ROUTES = ["/admin"];

/**
 * Next.js 16 Proxy（原 middleware）
 * 检查 session cookie，拦截未登录/无权限请求
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否匹配受保护路由
  const needsAuth = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const needsAdmin = ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!needsAuth && !needsAdmin) {
    return NextResponse.next();
  }

  // 从 cookie 获取 session token
  const token = request.cookies.get("session")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;

    // 管理员路由额外校验角色
    if (needsAdmin && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    // token 无效或过期
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*", "/orders/:path*", "/admin/:path*"],
};
