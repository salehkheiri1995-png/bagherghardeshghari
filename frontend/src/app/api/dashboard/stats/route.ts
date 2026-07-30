import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const authUser = await extractUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const [totalBookings, upcomingBookings, wishlistCount, reviewCount] = await Promise.all([
      prisma.booking.count({ where: { userId: authUser.userId } }),
      prisma.booking.count({ where: { userId: authUser.userId, status: { in: ["CONFIRMED", "PAID"] } } }),
      prisma.wishlist.count({ where: { userId: authUser.userId } }),
      prisma.review.count({ where: { userId: authUser.userId } }),
    ]);

    const nextBooking = await prisma.booking.findFirst({
      where: { userId: authUser.userId, status: { in: ["CONFIRMED", "PAID"] } },
      include: { tour: { select: { title: true, titleEn: true, slug: true, durationDays: true } }, tourDate: { select: { startDate: true, endDate: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalBookings,
        upcomingBookings,
        wishlistCount,
        reviewCount,
        nextBooking: nextBooking ? {
          tourTitle: nextBooking.tour?.titleEn || nextBooking.tour?.title,
          tourSlug: nextBooking.tour?.slug,
          duration: nextBooking.tour?.durationDays,
          startDate: nextBooking.tourDate?.startDate,
          endDate: nextBooking.tourDate?.endDate,
        } : null,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
