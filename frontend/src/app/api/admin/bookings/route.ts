import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractUserFromRequest } from "@/lib/auth";

// GET all bookings (admin)
export async function GET(request: Request) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { guestName: { contains: search } },
        { guestEmail: { contains: search } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          tour: { select: { titleEn: true, slug: true, type: true } },
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
    console.error("Admin get bookings error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PUT update booking status (admin)
export async function PUT(request: Request) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json({ success: false, error: "Booking ID and status are required" }, { status: 400 });
    }

    const validStatuses = ["PENDING", "PAID", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "REFUNDED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { status };
    if (status === "CONFIRMED") updateData.confirmedAt = new Date();
    if (status === "COMPLETED") updateData.completedAt = new Date();
    if (status === "CANCELLED") updateData.cancelledAt = new Date();

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        user: { select: { name: true, email: true } },
        tour: { select: { titleEn: true } },
      },
    });

    return NextResponse.json({ success: true, data: booking, message: "Booking updated" });
  } catch (error) {
    console.error("Admin update booking error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
