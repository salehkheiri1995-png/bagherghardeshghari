import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const BASE_URL = "https://visitiran.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/tours`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/map`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/fa`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/fa/tours`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  ];

  let tourPages: MetadataRoute.Sitemap = [];
  let articlePages: MetadataRoute.Sitemap = [];

  try {
    const [tours, articles] = await Promise.all([
      prisma.tour.findMany({
        where: { status: "PUBLISHED", isArchived: false },
        select: { slug: true, updatedAt: true, isFeatured: true },
      }),
      prisma.article.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true, isFeatured: true },
      }),
    ]);

    tourPages = tours.map((t) => ({
      url: `${BASE_URL}/tours/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly" as const,
      priority: t.isFeatured ? 0.9 : 0.8,
    }));

    articlePages = articles.map((a) => ({
      url: `${BASE_URL}/blog/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: a.isFeatured ? 0.8 : 0.7,
    }));
  } catch {}

  return [...staticPages, ...tourPages, ...articlePages];
}
