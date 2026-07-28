import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const tour = await prisma.tour.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!tour) {
      return NextResponse.json(
        { success: false, error: "Tour not found" },
        { status: 404 }
      );
    }

    const pastTours = await prisma.pastTour.findMany({
      where: { tourId: tour.id },
      orderBy: { date: "desc" },
      select: {
        id: true,
        title: true,
        titleFa: true,
        description: true,
        descriptionFa: true,
        date: true,
        guideName: true,
        guideNameFa: true,
        location: true,
        locationFa: true,
        photos: true,
        imageUrl: true,
        galleryImages: true,
        highlights: true,
        highlightsFa: true,
        participants: true,
        rating: true,
        weather: true,
        weatherFa: true,
      },
    });

    const data = pastTours.map((pt) => ({
      ...pt,
      date: pt.date.toISOString(),
      galleryImages: JSON.parse(pt.galleryImages || "[]"),
      highlights: JSON.parse(pt.highlights || "[]"),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Get past tours error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
