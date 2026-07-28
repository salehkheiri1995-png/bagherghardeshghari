import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true, rating: { gte: 4 } },
      select: {
        id: true,
        comment: true,
        rating: true,
        user: { select: { name: true, country: true } },
        tour: { select: { titleEn: true, titleFa: true } },
      },
      orderBy: { rating: "desc" },
      take: 6,
    });

    const data = reviews.map((r) => ({
      id: r.id,
      userName: r.user?.name || "Anonymous",
      comment: r.comment,
      rating: r.rating,
      country: r.user?.country || "",
      tourTitle: r.tour?.titleEn || "",
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Get featured reviews error:", error);
    return NextResponse.json({ success: true, data: [] });
  }
}
