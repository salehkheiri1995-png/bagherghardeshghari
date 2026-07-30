import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const authUser = await extractUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: authUser.userId },
      include: {
        tour: {
          select: {
            id: true, title: true, titleEn: true, titleFa: true, slug: true,
            type: true, difficulty: true, durationDays: true, price: true,
            averageRating: true, totalReviews: true, imageUrl: true, province: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: wishlist });
  } catch (error) {
    console.error("Get wishlist error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await extractUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tourId } = body;

    if (!tourId) {
      return NextResponse.json({ success: false, error: "Tour ID is required" }, { status: 400 });
    }

    const existing = await prisma.wishlist.findUnique({
      where: { userId_tourId: { userId: authUser.userId, tourId } },
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, data: null, message: "Removed from wishlist" });
    }

    const wishlist = await prisma.wishlist.create({
      data: { userId: authUser.userId, tourId },
    });

    return NextResponse.json({ success: true, data: wishlist, message: "Added to wishlist" }, { status: 201 });
  } catch (error) {
    console.error("Toggle wishlist error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
