import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TourStatus } from "@/generated/prisma/client";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const province = url.searchParams.get("province");
    const difficulty = url.searchParams.get("difficulty");
    const duration = url.searchParams.get("duration");
    const search = url.searchParams.get("search");
    const featured = url.searchParams.get("featured");

    const where: Record<string, unknown> = { status: TourStatus.PUBLISHED };
    if (type) where.type = type;
    if (province) where.province = province;
    if (difficulty) where.difficulty = difficulty;
    if (featured === "true") where.isFeatured = true;
    if (duration) {
      const parts = duration.split("-");
      if (parts.length === 2) {
        where.durationDays = { gte: parseInt(parts[0]), lte: parseInt(parts[1]) };
      }
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { titleEn: { contains: search } },
        { titleFa: { contains: search } },
        { province: { contains: search } },
        { location: { contains: search } },
      ];
    }

    const tours = await prisma.tour.findMany({
      where,
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
        capacity: true,
        location: true,
        province: true,
        city: true,
        averageRating: true,
        totalReviews: true,
        isFeatured: true,
        guideLang: true,
        imageUrl: true,
        descriptionEn: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: tours });
  } catch (error) {
    console.error("Get tours error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
