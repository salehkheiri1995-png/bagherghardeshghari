import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";
import { hashPassword, generateToken } from "@/lib/auth";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { validateEmail, validatePassword, validateName, sanitizeInput } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const clientIP = getClientIP(request);
    const rateLimit = await checkRateLimit(`register:${clientIP}`, {
      windowMs: 300000,
      maxRequests: 3,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, password, country, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (!validateName(name)) {
      return NextResponse.json(
        { success: false, error: "Name must be 2-100 characters" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, error: passwordValidation.errors[0] },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: sanitizeInput(name),
        email: sanitizeInput(email),
        password: hashedPassword,
        country: country ? sanitizeInput(country) : null,
        phone: phone ? sanitizeInput(phone) : null,
        role: Role.USER,
      },
    });

    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: userWithoutPassword,
          token,
        },
        message: "Registration successful",
      },
      { status: 201 }
    );

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
