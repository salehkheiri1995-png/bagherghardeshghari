import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseJsonField } from "@/utils/json-helpers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const tour = await prisma.tour.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        titleEn: true,
        titleFa: true,
        slug: true,
        type: true,
        difficulty: true,
        durationDays: true,
        price: true,
        priceToman: true,
        discountPrice: true,
        currency: true,
        capacity: true,
        location: true,
        provinceRef: { select: { name: true, nameEn: true } },
        city: true,
        description: true,
        descriptionEn: true,
        descriptionFa: true,
        includes: true,
        includesFa: true,
        excludes: true,
        excludesFa: true,
        requirements: true,
        requirementsFa: true,
        itinerary: true,
        itineraryFa: true,
        status: true,
        isFeatured: true,
        averageRating: true,
        totalReviews: true,
        totalBookings: true,
        guideLang: true,
        imageUrl: true,
        galleryImages: true,
        latitude: true,
        longitude: true,
        tourDates: {
          where: { isActive: true, startDate: { gte: new Date() } },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            availableSpots: true,
            maxCapacity: true,
            specialPrice: true,
            notes: true,
          },
          orderBy: { startDate: "asc" },
        },
      },
    });

    if (!tour || tour.status !== "PUBLISHED") {
      return NextResponse.json(
        { success: false, error: "Tour not found" },
        { status: 404 }
      );
    }

    const data = {
      ...tour,
      includes: parseJsonField<string>(tour.includes),
      includesFa: parseJsonField<string>(tour.includesFa),
      excludes: parseJsonField<string>(tour.excludes),
      excludesFa: parseJsonField<string>(tour.excludesFa),
      requirements: parseJsonField<string>(tour.requirements),
      requirementsFa: parseJsonField<string>(tour.requirementsFa),
      itinerary: parseJsonField(tour.itinerary),
      itineraryFa: parseJsonField(tour.itineraryFa),
      galleryImages: parseJsonField<string>(tour.galleryImages),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Get tour by slug error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
