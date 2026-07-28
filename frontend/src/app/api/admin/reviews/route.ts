import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractUserFromRequest } from "@/lib/auth";

// GET all reviews (admin)
export async function GET(request: Request) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const where: Record<string, unknown> = {};
    if (status === "pending") where.isApproved = false;
    if (status === "approved") where.isApproved = true;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          tour: { select: { titleEn: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin get reviews error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PUT approve/reject review (admin)
export async function PUT(request: Request) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { reviewId, isApproved } = body;

    if (!reviewId || isApproved === undefined) {
      return NextResponse.json({ success: false, error: "Review ID and approval status are required" }, { status: 400 });
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved },
      include: {
        user: { select: { name: true, email: true } },
        tour: { select: { titleEn: true } },
      },
    });

    return NextResponse.json({ success: true, data: review, message: isApproved ? "Review approved" : "Review rejected" });
  } catch (error) {
    console.error("Admin update review error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE review (admin)
export async function DELETE(request: Request) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const url = new URL(request.url);
    const reviewId = url.searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json({ success: false, error: "Review ID is required" }, { status: 400 });
    }

    await prisma.review.delete({ where: { id: reviewId } });

    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("Admin delete review error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
