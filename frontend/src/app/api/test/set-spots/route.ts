import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  try {
    const { tourDateId, spots } = await request.json();

    if (!tourDateId || typeof spots !== "number" || spots < 0) {
      return NextResponse.json({ error: "tourDateId and valid spots required" }, { status: 400 });
    }

    await prisma.tourDate.update({
      where: { id: tourDateId },
      data: { availableSpots: spots },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Set spots error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
