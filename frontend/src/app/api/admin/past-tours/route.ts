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
    const tourId = url.searchParams.get("tourId");

    const where: Record<string, unknown> = {};
    if (tourId) where.tourId = tourId;

    const pastTours = await prisma.pastTour.findMany({
      where,
      include: { tour: { select: { title: true, titleEn: true, slug: true } } },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ success: true, data: pastTours });
  } catch (error) {
    console.error("Admin get past tours error:", error);
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
      tourId, title, titleFa, description, descriptionFa,
      date, guideName, guideNameFa, location, locationFa,
      photos, imageUrl, galleryImages, highlights, highlightsFa,
      participants, rating, weather, weatherFa,
    } = body;

    if (!tourId || !title || !date || !guideName) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const pastTour = await prisma.pastTour.create({
      data: {
        tourId, title, titleFa: titleFa || null,
        description: description || "", descriptionFa: descriptionFa || null,
        date: new Date(date), guideName, guideNameFa: guideNameFa || null,
        location: location || "", locationFa: locationFa || null,
        photos: photos || 0, imageUrl: imageUrl || null,
        galleryImages: JSON.stringify(galleryImages || []),
        highlights: JSON.stringify(highlights || []),
        highlightsFa: highlightsFa || null,
        participants: participants || null, rating: rating || null,
        weather: weather || null, weatherFa: weatherFa || null,
      },
    });

    return NextResponse.json({ success: true, data: pastTour, message: "Past tour created" }, { status: 201 });
  } catch (error) {
    console.error("Admin create past tour error:", error);
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
    const { pastTourId, ...updateData } = body;

    if (!pastTourId) {
      return NextResponse.json({ success: false, error: "Past tour ID is required" }, { status: 400 });
    }

    if (updateData.date) updateData.date = new Date(updateData.date);
    if (updateData.galleryImages) updateData.galleryImages = JSON.stringify(updateData.galleryImages);
    if (updateData.highlights) updateData.highlights = JSON.stringify(updateData.highlights);

    const pastTour = await prisma.pastTour.update({
      where: { id: pastTourId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: pastTour, message: "Past tour updated" });
  } catch (error) {
    console.error("Admin update past tour error:", error);
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
    const pastTourId = url.searchParams.get("pastTourId");

    if (!pastTourId) {
      return NextResponse.json({ success: false, error: "Past tour ID is required" }, { status: 400 });
    }

    await prisma.pastTour.delete({ where: { id: pastTourId } });

    return NextResponse.json({ success: true, message: "Past tour deleted" });
  } catch (error) {
    console.error("Admin delete past tour error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
