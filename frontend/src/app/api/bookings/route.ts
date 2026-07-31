import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { BookingStatus } from "@/generated/prisma/client";
import { extractUserFromRequest } from "@/lib/auth";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { validateBookingInput, sanitizeInput } from "@/lib/validation";
import { sendEmail, bookingConfirmationEmail } from "@/lib/email";
import { SERVICE_PRICES } from "@/lib/constants";

// GET all bookings for current user
export async function GET(request: Request) {
  try {
    const authUser = await extractUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const where: Record<string, unknown> = { userId: authUser.userId };
    if (status) where.status = status;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          tour: { select: { title: true, titleEn: true, slug: true, type: true, durationDays: true, provinceRef: { select: { name: true, nameEn: true } } } },
          tourDate: { select: { startDate: true, endDate: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST create new booking
export async function POST(request: Request) {
  try {
    const clientIP = getClientIP(request);
    const rateLimit = await checkRateLimit(`booking:${clientIP}`, {
      windowMs: 60000,
      maxRequests: 5,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const authUser = await extractUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tourId, tourDateId, numberOfGuests, guestName, guestEmail, guestPhone, guestCountry, specialRequests, transportService, accommodationService, insuranceService, visaService, couponCode } = body;

    if (!tourId || !numberOfGuests) {
      return NextResponse.json({ success: false, error: "Tour ID and number of guests are required" }, { status: 400 });
    }

    const validation = validateBookingInput({ firstName: guestName?.split(" ")[0], lastName: guestName?.split(" ").slice(1).join(" "), email: guestEmail, phone: guestPhone });
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.errors[0] }, { status: 400 });
    }

    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) {
      return NextResponse.json({ success: false, error: "Tour not found" }, { status: 404 });
    }

    let tourDate = null;
    if (tourDateId) {
      tourDate = await prisma.tourDate.findUnique({ where: { id: tourDateId } });
      if (!tourDate || !tourDate.isActive) {
        return NextResponse.json({ success: false, error: "Tour date not found or inactive" }, { status: 400 });
      }
    }

    const basePrice = (tourDate?.specialPrice || tour.price) * numberOfGuests;
    let totalPrice = basePrice;

    let discountAmount = 0;
    let couponId: string | null = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && new Date() >= coupon.validFrom && new Date() <= coupon.validUntil) {
        if (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) {
          couponId = coupon.id;
          if (coupon.discountType === "PERCENTAGE") {
            discountAmount = totalPrice * (coupon.discountValue / 100);
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else {
            discountAmount = coupon.discountValue;
          }
        }
      }
    }

    if (transportService) totalPrice += SERVICE_PRICES.transport * numberOfGuests;
    if (accommodationService) totalPrice += SERVICE_PRICES.accommodation * numberOfGuests;
    if (insuranceService) totalPrice += SERVICE_PRICES.insurance * numberOfGuests;
    if (visaService) totalPrice += SERVICE_PRICES.visa * numberOfGuests;

    const finalPrice = totalPrice - discountAmount;

    const booking = await prisma.$transaction(async (tx) => {
      const client = tx as typeof prisma;
      if (tourDateId) {
        // Atomic spot reservation: `updateMany` with `gte` condition ensures that
        // if availableSpots < numberOfGuests, the update affects 0 rows and throws.
        // This prevents race conditions where two concurrent requests could both
        // read availableSpots=2, each try to book 2, and both succeed (overbooking).
        const spotResult = await client.tourDate.updateMany({
          where: { id: tourDateId, availableSpots: { gte: numberOfGuests } },
          data: { availableSpots: { decrement: numberOfGuests } },
        });
        if (spotResult.count === 0) {
          throw new Error("NOT_ENOUGH_SPOTS");
        }
      }

      if (couponId) {
        await client.coupon.update({ where: { id: couponId }, data: { usageCount: { increment: 1 } } });
      }

      await client.tour.update({
        where: { id: tourId },
        data: { totalBookings: { increment: 1 } },
      });

      return client.booking.create({
        data: {
          userId: authUser.userId,
          tourId,
          tourDateId: tourDateId || null,
          numberOfGuests,
          totalPrice,
          discountAmount,
          finalPrice,
          currency: tour.currency,
          status: BookingStatus.PENDING,
          guestName: guestName ? sanitizeInput(guestName) : null,
          guestEmail: guestEmail ? sanitizeInput(guestEmail) : null,
          guestPhone: guestPhone ? sanitizeInput(guestPhone) : null,
          guestCountry: guestCountry ? sanitizeInput(guestCountry) : null,
          specialRequests: specialRequests ? sanitizeInput(specialRequests) : null,
          transportService: transportService || false,
          accommodationService: accommodationService || false,
          insuranceService: insuranceService || false,
          visaService: visaService || false,
          couponCode: couponCode || null,
          couponId: couponId || null,
        },
        include: {
          tour: { select: { title: true, titleEn: true, slug: true } },
        },
      });
    });

    if (guestEmail) {
      try {
        await sendEmail({
          to: guestEmail,
          subject: `Booking Confirmed - ${booking.tour.titleEn || booking.tour.title}`,
          html: bookingConfirmationEmail({
            guestName,
            guestEmail,
            tourName: booking.tour.titleEn || booking.tour.title,
            numberOfGuests,
            finalPrice: booking.finalPrice,
            currency: booking.currency,
            bookingId: booking.id,
          }),
        });
      } catch (emailError) {
        console.error("Error sending booking confirmation email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      data: booking,
      message: "Booking created successfully",
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_ENOUGH_SPOTS") {
      return NextResponse.json({ success: false, error: "Not enough spots available" }, { status: 409 });
    }
    console.error("Create booking error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
