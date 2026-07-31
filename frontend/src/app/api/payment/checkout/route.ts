import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { extractUserFromRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { BookingStatus } from "@/generated/prisma/client";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const clientIP = getClientIP(request);
    const rateLimit = await checkRateLimit(`payment:${clientIP}`, {
      windowMs: 60000,
      maxRequests: 5,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const authUser = await extractUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        tour: { select: { title: true, titleEn: true, slug: true, price: true } },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.userId !== authUser.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (booking.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: "Booking is not pending" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!stripe) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { success: false, error: "Payment not configured" },
          { status: 503 }
        );
      }

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CONFIRMED,
          confirmedAt: new Date(),
          paymentMethod: "manual",
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          sessionId: null,
          url: `${baseUrl}/booking/success?booking_id=${bookingId}`,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: booking.guestEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: booking.tour.titleEn || booking.tour.title,
              description: `Tour booking for ${booking.numberOfGuests} guest(s)`,
            },
            unit_amount: Math.round(booking.finalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/booking/cancel`,
      metadata: {
        bookingId: booking.id,
        userId: authUser.userId,
      },
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentId: session.payment_intent as string || null,
        stripeSessionId: session.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    console.error("Payment session error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create payment session" },
      { status: 500 }
    );
  }
}
