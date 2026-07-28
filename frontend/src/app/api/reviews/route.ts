import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractUserFromRequest } from "@/lib/auth";

// GET reviews for a tour
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const tourId = url.searchParams.get("tourId");

    if (!tourId) {
      return NextResponse.json({ success: false, error: "Tour ID is required" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { tourId, isApproved: true },
      include: { user: { select: { name: true, avatar: true, country: true } } },
      orderBy: { createdAt: "desc" },
    });

    const avgResult = await prisma.review.aggregate({
      where: { tourId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        averageRating: avgResult._avg.rating || 0,
        totalReviews: avgResult._count.rating,
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST create review
export async function POST(request: Request) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tourId, rating, title, comment, pros, cons, travelDate } = body;

    if (!tourId || !rating || !comment) {
      return NextResponse.json({ success: false, error: "Tour ID, rating and comment are required" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // Check if user has a completed booking for this tour
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: authUser.userId,
        tourId,
        status: "COMPLETED",
      },
    });

    // Check if user already reviewed this tour
    const existingReview = await prisma.review.findUnique({
      where: { userId_tourId: { userId: authUser.userId, tourId } },
    });

    if (existingReview) {
      return NextResponse.json({ success: false, error: "You have already reviewed this tour" }, { status: 409 });
    }

    const review = await prisma.review.create({
      data: {
        userId: authUser.userId,
        tourId,
        rating,
        title: title || null,
        comment,
        pros: pros || null,
        cons: cons || null,
        travelDate: travelDate ? new Date(travelDate) : null,
        isVerified: !!existingBooking,
        isApproved: false, // Requires admin approval
      },
      include: { user: { select: { name: true, avatar: true } } },
    });

    // Update tour average rating
    const avgResult = await prisma.review.aggregate({
      where: { tourId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.tour.update({
      where: { id: tourId },
      data: {
        averageRating: avgResult._avg.rating || rating,
        totalReviews: avgResult._count.rating + 1,
      },
    });

    return NextResponse.json({
      success: true,
      data: review,
      message: "Review submitted successfully. It will be visible after admin approval.",
    }, { status: 201 });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
