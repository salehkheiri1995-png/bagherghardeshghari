import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let tour: {
    titleEn: string;
    province: string;
    price: number;
    durationDays: number;
  } | null = null;

  try {
    tour = await prisma.tour.findUnique({
      where: { slug },
      select: {
        titleEn: true,
        province: true,
        price: true,
        durationDays: true,
      },
    });
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: "#6ee7b7",
            marginBottom: 16,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          VISITIRAN.COM
        </div>
        <div
          style={{
            fontSize: tour?.titleEn && tour.titleEn.length > 40 ? 42 : 52,
            fontWeight: "bold",
            color: "white",
            marginBottom: 24,
            lineHeight: 1.2,
            maxWidth: "80%",
          }}
        >
          {tour?.titleEn || "Discover Iran"}
        </div>
        {tour && (
          <div
            style={{
              display: "flex",
              gap: 32,
              color: "#a7f3d0",
              fontSize: 26,
            }}
          >
            <span>📍 {tour.province}</span>
            <span>⏱ {tour.durationDays} Days</span>
            <span>💰 From ${tour.price}</span>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            color: "#6ee7b7",
            fontSize: 20,
            opacity: 0.8,
          }}
        >
          Guided Tours · Iran
        </div>
      </div>
    ),
    { ...size }
  );
}
