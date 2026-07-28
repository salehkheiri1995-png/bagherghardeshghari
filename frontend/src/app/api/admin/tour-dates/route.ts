import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractUserFromRequest } from "@/lib/auth";

// GET all tour dates (admin) - optionally filter by tourId
export async function GET(request: Request) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const url = new URL(request.url);
    const tourId = url.searchParams.get("tourId");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const where: Record<string, unknown> = {};
    if (tourId) where.tourId = tourId;

    const [tourDates, total] = await Promise.all([
      prisma.tourDate.findMany({
        where,
        include: {
          tour: { select: { id: true, titleEn: true, titleFa: true, slug: true, price: true, capacity: true } },
          _count: { select: { bookings: true } },
        },
        orderBy: { startDate: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.tourDate.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: tourDates,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin get tour dates error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST create tour date (admin)
export async function POST(request: Request) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { tourId, startDate, endDate, maxCapacity, specialPrice, notes } = body;

    if (!tourId || !startDate || !endDate) {
      return NextResponse.json({ success: false, error: "Tour ID, start date, and end date are required" }, { status: 400 });
    }

    const tour = await prisma.tour.findUnique({ where: { id: tourId }, select: { capacity: true } });
    if (!tour) {
      return NextResponse.json({ success: false, error: "Tour not found" }, { status: 404 });
    }

    const tourDate = await prisma.tourDate.create({
      data: {
        tourId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxCapacity: maxCapacity || tour.capacity,
        availableSpots: maxCapacity || tour.capacity,
        specialPrice: specialPrice || null,
        notes: notes || null,
        isActive: true,
      },
      include: {
        tour: { select: { titleEn: true, slug: true } },
      },
    });

    return NextResponse.json({ success: true, data: tourDate, message: "Tour date created" }, { status: 201 });
  } catch (error) {
    console.error("Admin create tour date error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PUT update tour date (admin)
export async function PUT(request: Request) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { tourDateId, startDate, endDate, maxCapacity, availableSpots, specialPrice, notes, isActive } = body;

    if (!tourDateId) {
      return NextResponse.json({ success: false, error: "Tour Date ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (maxCapacity !== undefined) updateData.maxCapacity = maxCapacity;
    if (availableSpots !== undefined) updateData.availableSpots = availableSpots;
    if (specialPrice !== undefined) updateData.specialPrice = specialPrice;
    if (notes !== undefined) updateData.notes = notes;
    if (isActive !== undefined) updateData.isActive = isActive;

    const tourDate = await prisma.tourDate.update({
      where: { id: tourDateId },
      data: updateData,
      include: {
        tour: { select: { titleEn: true, slug: true } },
        _count: { select: { bookings: true } },
      },
    });

    return NextResponse.json({ success: true, data: tourDate, message: "Tour date updated" });
  } catch (error) {
    console.error("Admin update tour date error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE tour date (admin)
export async function DELETE(request: Request) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const url = new URL(request.url);
    const tourDateId = url.searchParams.get("tourDateId");

    if (!tourDateId) {
      return NextResponse.json({ success: false, error: "Tour Date ID is required" }, { status: 400 });
    }

    const bookingsCount = await prisma.booking.count({ where: { tourDateId } });
    if (bookingsCount > 0) {
      return NextResponse.json({ success: false, error: "Cannot delete tour date with existing bookings" }, { status: 400 });
    }

    await prisma.tourDate.delete({ where: { id: tourDateId } });

    return NextResponse.json({ success: true, message: "Tour date deleted" });
  } catch (error) {
    console.error("Admin delete tour date error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
