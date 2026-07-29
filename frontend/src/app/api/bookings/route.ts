import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractUserFromRequest } from "@/lib/auth";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { validateBookingInput, sanitizeInput } from "@/lib/validation";
import { sendEmail, bookingConfirmationEmail } from "@/lib/email";

// GET all bookings for current user
export async function GET(request: Request) {
  try {
    const authUser = extractUserFromRequest(request);
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
          tour: { select: { title: true, titleEn: true, slug: true, type: true, durationDays: true, province: true } },
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
    const rateLimit = checkRateLimit(`booking:${clientIP}`, {
      windowMs: 60000,
      maxRequests: 5,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const authUser = extractUserFromRequest(request);
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
      if (tourDate.availableSpots < numberOfGuests) {
        return NextResponse.json({ success: false, error: "Not enough spots available" }, { status: 400 });
      }
    }

    let totalPrice = (tourDate?.specialPrice || tour.price) * numberOfGuests;

    // Apply coupon discount
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && new Date() >= coupon.validFrom && new Date() <= coupon.validUntil) {
        if (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) {
          if (coupon.discountType === "PERCENTAGE") {
            discountAmount = totalPrice * (coupon.discountValue / 100);
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else {
            discountAmount = coupon.discountValue;
          }
          // Update coupon usage
          await prisma.coupon.update({ where: { id: coupon.id }, data: { usageCount: { increment: 1 } } });
        }
      }
    }

    // Add service costs
    if (transportService) totalPrice += 50 * numberOfGuests;
    if (accommodationService) totalPrice += 100 * numberOfGuests;
    if (insuranceService) totalPrice += 30 * numberOfGuests;
    if (visaService) totalPrice += 80 * numberOfGuests;

    const finalPrice = totalPrice - discountAmount;

    const booking = await prisma.booking.create({
      data: {
        userId: authUser.userId,
        tourId,
        tourDateId: tourDateId || null,
        numberOfGuests,
        totalPrice: (tourDate?.specialPrice || tour.price) * numberOfGuests,
        discountAmount,
        finalPrice,
        currency: tour.currency,
        status: "PENDING",
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
      },
      include: {
        tour: { select: { title: true, titleEn: true, slug: true } },
      },
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

    // Decrement available spots on tour date
    if (tourDateId && tourDate) {
      await prisma.tourDate.update({
        where: { id: tourDateId },
        data: { availableSpots: { decrement: numberOfGuests } },
      });
    }

    // Increment total bookings on tour
    await prisma.tour.update({
      where: { id: tourId },
      data: { totalBookings: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      data: booking,
      message: "Booking created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
