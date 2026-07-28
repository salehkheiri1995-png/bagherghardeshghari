import type { MetadataRoute } from "next";

const BASE_URL = "https://visitiran.com";

const tours = [
  "mount-damavand-expedition",
  "hyrcanian-forest-adventure",
  "isfahan-cultural-heritage",
  "masuleh-kandovan-villages",
  "lut-desert-adventure",
  "historic-yazd-city-tour",
  "shiraz-persepolis-discovery",
  "caspian-sea-nature",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/tours`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/map`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  const tourPages = tours.map((slug) => ({
    url: `${BASE_URL}/tours/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...tourPages];
}
