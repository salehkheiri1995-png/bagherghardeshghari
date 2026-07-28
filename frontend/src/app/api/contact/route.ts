import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { validateEmail, validateMessage, sanitizeInput } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(`contact:${clientIP}`, {
      windowMs: 60000,
      maxRequests: 5,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email and message are required" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!validateMessage(message)) {
      return NextResponse.json(
        { success: false, error: "Message must be 10-2000 characters" },
        { status: 400 }
      );
    }

    await prisma.contactMessage.create({
      data: {
        name: sanitizeInput(name),
        email: sanitizeInput(email),
        subject: subject ? sanitizeInput(subject) : null,
        message: sanitizeInput(message),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
