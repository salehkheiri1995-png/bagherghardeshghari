import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const authUser = await extractUserFromRequest(request);
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
        { title: { contains: search } },
        { titleEn: { contains: search } },
      ];
    }

    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where,
        include: { _count: { select: { bookings: true, reviews: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.tour.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: tours,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin get tours error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title, titleEn, titleFa, type, difficulty, durationDays, price, priceToman, capacity,
      location, provinceId, description, descriptionEn, descriptionFa,
      includes, includesFa, excludes, excludesFa, requirements, requirementsFa, itinerary, itineraryFa,
      imageUrl, latitude, longitude,
    } = body;

    if (!title || !titleEn || !type || !price || !capacity) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const slug = titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const tour = await prisma.tour.create({
      data: {
        title, titleEn, titleFa: titleFa || "", slug, type, difficulty: difficulty || "MODERATE",
        durationDays: durationDays || 1, price, priceToman: priceToman || null, capacity,
        location: location || "", provinceId: provinceId || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        description: description || "", descriptionEn: descriptionEn || titleEn, descriptionFa: descriptionFa || "",
        imageUrl: imageUrl || null,
        includes: JSON.stringify(includes || []),
        includesFa: JSON.stringify(includesFa || []),
        excludes: JSON.stringify(excludes || []),
        excludesFa: JSON.stringify(excludesFa || []),
        requirements: JSON.stringify(requirements || []),
        requirementsFa: JSON.stringify(requirementsFa || []),
        itinerary: JSON.stringify(itinerary || []),
        itineraryFa: JSON.stringify(itineraryFa || []),
        status: status || "PUBLISHED",
        createdBy: authUser.userId,
      },
    });

    return NextResponse.json({ success: true, data: tour, message: "Tour created" }, { status: 201 });
  } catch (error) {
    console.error("Admin create tour error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authUser = await extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { tourId, ...updateData } = body;

    if (!tourId) {
      return NextResponse.json({ success: false, error: "Tour ID is required" }, { status: 400 });
    }

    if (updateData.includes) updateData.includes = JSON.stringify(updateData.includes);
    if (updateData.includesFa) updateData.includesFa = JSON.stringify(updateData.includesFa);
    if (updateData.excludes) updateData.excludes = JSON.stringify(updateData.excludes);
    if (updateData.excludesFa) updateData.excludesFa = JSON.stringify(updateData.excludesFa);
    if (updateData.requirements) updateData.requirements = JSON.stringify(updateData.requirements);
    if (updateData.requirementsFa) updateData.requirementsFa = JSON.stringify(updateData.requirementsFa);
    if (updateData.itinerary) updateData.itinerary = JSON.stringify(updateData.itinerary);
    if (updateData.itineraryFa) updateData.itineraryFa = JSON.stringify(updateData.itineraryFa);
    if (updateData.titleEn) {
      updateData.slug = updateData.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    const tour = await prisma.tour.update({
      where: { id: tourId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: tour, message: "Tour updated" });
  } catch (error) {
    console.error("Admin update tour error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authUser = await extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const url = new URL(request.url);
    const tourId = url.searchParams.get("tourId");

    if (!tourId) {
      return NextResponse.json({ success: false, error: "Tour ID is required" }, { status: 400 });
    }

    await prisma.tour.delete({ where: { id: tourId } });

    return NextResponse.json({ success: true, message: "Tour deleted" });
  } catch (error) {
    console.error("Admin delete tour error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
