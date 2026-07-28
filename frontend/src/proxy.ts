import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

/**
 * مسیرهایی که فقط برای کاربران لاگین‌شده هستن
 */
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/bookings"];

/**
 * مسیرهایی که فقط ADMIN یا SUPER_ADMIN می‌تونن بهشون دسترسی داشته باشن
 */
const ADMIN_ROUTES = ["/admin", "/api/admin"];

/**
 * API هایی که بدون توکن هم باید کار کنن
 */
const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/tours",
  "/api/reviews",
  "/api/payment/webhook",
];

function isPublicApiRoute(pathname: string): boolean {
  return PUBLIC_API_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // مسیرهای public API رو رد کن
  if (isPublicApiRoute(pathname)) {
    return NextResponse.next();
  }

  // توکن رو از Authorization header یا cookie بخون
  const authHeader = request.headers.get("Authorization");
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;
  const tokenFromCookie = request.cookies.get("auth-token")?.value;
  const token = tokenFromHeader || tokenFromCookie;

  // --- بررسی مسیرهای Admin ---
  if (isAdminRoute(pathname)) {
    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Access denied. Admin role required." },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    // ادمین تأیید شد — اطلاعات کاربر رو به header اضافه کن
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-role", payload.role);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // --- بررسی مسیرهای Protected (dashboard, profile, ...) ---
  if (isProtectedRoute(pathname)) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/bookings/:path*",
  ],
};
