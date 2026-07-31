import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractUserFromRequest } from "@/lib/auth";
import { TourStatus, BookingStatus } from "@/generated/prisma/client";

export async function GET(request: Request) {
  try {
    const authUser = await extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const [
      totalUsers, totalTours, totalBookings, totalRevenue, recentBookings, tourStats,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.tour.count({ where: { status: TourStatus.PUBLISHED } }),
      prisma.booking.count(),
      prisma.booking.aggregate({
        where: { status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] } },
        _sum: { finalPrice: true },
      }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true } },
          tour: { select: { titleEn: true, slug: true } },
        },
      }),
      prisma.tour.findMany({
        where: { status: TourStatus.PUBLISHED },
        orderBy: { totalBookings: "desc" },
        take: 5,
        select: { titleEn: true, totalBookings: true, price: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers, totalTours, totalBookings,
          totalRevenue: totalRevenue._sum.finalPrice || 0,
        },
        recentBookings,
        popularTours: tourStats,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
