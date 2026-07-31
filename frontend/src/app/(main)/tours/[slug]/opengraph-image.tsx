import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let title = "VisitIran Tour";
  let province = "Iran";
  let price = 0;
  let durationDays = 0;

  try {
    const tour = await prisma.tour.findUnique({
      where: { slug },
      select: { titleEn: true, provinceRef: { select: { name: true, nameEn: true } }, price: true, durationDays: true },
    });
    if (tour) {
      title = tour.titleEn;
      province = tour.provinceRef?.nameEn || tour.provinceRef?.name || "";
      price = tour.price;
      durationDays = tour.durationDays;
    }
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at top right, rgba(16,185,129,0.15) 0%, transparent 60%)",
          }}
        />
        <div style={{ marginBottom: 16 }}>
          <span
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "#6ee7b7",
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            VisitIran
          </span>
        </div>
        <div style={{ color: "white", fontSize: 52, fontWeight: "bold", lineHeight: 1.2, marginBottom: 20, maxWidth: 900 }}>
          {title}
        </div>
        <div style={{ display: "flex", gap: 32, color: "#6ee7b7", fontSize: 26 }}>
          <span>📍 {province}</span>
          {durationDays > 0 && <span>⏱ {durationDays} Days</span>}
          {price > 0 && <span>💰 From ${price}</span>}
        </div>
        <div style={{ position: "absolute", bottom: 40, right: 60, color: "rgba(255,255,255,0.4)", fontSize: 20 }}>
          visitiran.com
        </div>
      </div>
    ),
    { ...size }
  );
}
