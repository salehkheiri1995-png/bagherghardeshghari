import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { validateEmail } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const clientIP = getClientIP(request);
    const rateLimit = await checkRateLimit(`newsletter:${clientIP}`, {
      windowMs: 60000,
      maxRequests: 3,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      );
    }

    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { success: false, error: "Email already subscribed" },
          { status: 409 }
        );
      } else {
        await prisma.newsletter.update({
          where: { email },
          data: { isActive: true },
        });
        return NextResponse.json({
          success: true,
          message: "Successfully resubscribed to newsletter",
        });
      }
    }

    await prisma.newsletter.create({
      data: { email, isActive: true },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const clientIP = getClientIP(request);
    const rateLimit = await checkRateLimit(`newsletter-unsub:${clientIP}`, {
      windowMs: 60000,
      maxRequests: 5,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: "Email not found" },
        { status: 404 }
      );
    }

    await prisma.newsletter.update({
      where: { email },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    console.error("Newsletter unsubscription error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
