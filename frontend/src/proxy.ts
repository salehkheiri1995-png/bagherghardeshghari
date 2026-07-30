import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PROTECTED_ROUTES = ["/dashboard", "/profile", "/bookings", "/booking"];
const ADMIN_ROUTES = ["/admin", "/api/admin"];

const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/set-cookie",
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

async function verifyJwt(token: string): Promise<{ userId: string; email: string; role: string } | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicApiRoute(pathname)) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("Authorization");
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;
  const tokenFromCookie = request.cookies.get("auth-token")?.value;
  const token = tokenFromHeader || tokenFromCookie;

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

    const payload = await verifyJwt(token);

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

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-role", payload.role);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (isProtectedRoute(pathname)) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      );
    }

    const payload = await verifyJwt(token);
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
    "/booking/:path*",
  ],
};
