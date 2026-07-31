import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const provinces = await prisma.province.findMany({
      select: { id: true, name: true, nameEn: true },
      orderBy: { nameEn: "asc" },
    });

    return NextResponse.json({ success: true, data: provinces });
  } catch (error) {
    console.error("Get provinces error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
