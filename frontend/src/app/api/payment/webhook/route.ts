import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { BookingStatus } from "@/generated/prisma/client";
import Stripe from "stripe";

// لازم است تا Next.js body رو به صورت raw بخونه نه JSON پارس شده
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("❌ STRIPE_WEBHOOK_SECRET is not set in environment variables.");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Invalid signature: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.bookingId) {
          await prisma.booking.update({
            where: { id: session.metadata.bookingId },
            data: {
              status: BookingStatus.CONFIRMED,
              paymentId: (session.payment_intent as string) || session.id,
              paidAt: new Date(),
              confirmedAt: new Date(),
            },
          });
          console.log(`✅ Booking ${session.metadata.bookingId} confirmed.`);
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.bookingId) {
          await prisma.booking.update({
            where: { id: session.metadata.bookingId },
            data: { status: BookingStatus.CANCELLED },
          });
          console.log(`⚠️  Booking ${session.metadata.bookingId} cancelled (session expired).`);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.bookingId;
        if (bookingId) {
          await prisma.booking.update({
            where: { id: bookingId },
            data: { status: BookingStatus.FAILED },
          });
          console.log(`❌ Booking ${bookingId} marked as FAILED.`);
        }
        break;
      }

      default:
        // سایر event ها نادیده گرفته میشن
        break;
    }
  } catch (dbErr) {
    console.error("❌ Database update failed in webhook:", dbErr);
    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
