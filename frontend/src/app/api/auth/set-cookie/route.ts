import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    if (!body) {
      const response = NextResponse.json({ success: true });
      response.cookies.delete("auth-token");
      return response;
    }
    const { token } = JSON.parse(body);
    if (!token) {
      const response = NextResponse.json({ success: true });
      response.cookies.delete("auth-token");
      return response;
    }
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("auth-token");
    return response;
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("auth-token");
  return response;
}
