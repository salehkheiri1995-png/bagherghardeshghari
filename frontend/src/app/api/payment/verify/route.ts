import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { extractUserFromRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 });
    }

    if (!stripe) {
      return NextResponse.json({ success: false, error: "Payment not configured" }, { status: 503 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.metadata?.bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: session.metadata.bookingId },
        include: {
          tour: { select: { titleEn: true, title: true, slug: true } },
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          status: session.payment_status,
          booking,
        },
      });
    }

    return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}
