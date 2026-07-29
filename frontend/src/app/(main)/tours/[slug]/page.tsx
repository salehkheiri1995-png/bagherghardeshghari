import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import TourDetailClient from "./TourDetailClient";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  const tour = await prisma.tour.findUnique({
    where: { slug },
    select: {
      titleEn: true,
      titleFa: true,
      descriptionEn: true,
      description: true,
      imageUrl: true,
      price: true,
      province: true,
      type: true,
      durationDays: true,
      averageRating: true,
      totalReviews: true,
    },
  });

  if (!tour) return {};

  const title = tour.titleEn;
  const description = (
    tour.descriptionEn || tour.description || ""
  ).slice(0, 160);
  const image = tour.imageUrl || "https://visitiran.com/og-default.jpg";

  return {
    title,
    description,
    keywords: [
      `Iran ${tour.type.toLowerCase()} tour`,
      `${tour.province} tour`,
      `Iran travel ${tour.durationDays} days`,
      "Iran guided tour",
      "Visit Iran",
      tour.titleEn,
    ],
    alternates: {
      canonical: `https://visitiran.com/tours/${slug}`,
      languages: {
        en: `https://visitiran.com/tours/${slug}`,
        fa: `https://visitiran.com/fa/tours/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://visitiran.com/tours/${slug}`,
      siteName: "VisitIran",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      site: "@visitiran",
    },
  };
}

export async function generateStaticParams() {
  try {
    const tours = await prisma.tour.findMany({
      where: { status: "PUBLISHED", isArchived: false },
      select: { slug: true },
    });
    return tours.map((t) => ({ slug: t.slug }));
  } catch {
    return [];
  }
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tour = await prisma.tour.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!tour) notFound();

  return <TourDetailClient slug={slug} />;
}
