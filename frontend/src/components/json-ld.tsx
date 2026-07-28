interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
}

export function OrganizationSchema({
  name = "VisitIran",
  url = "https://visitiran.com",
  logo = "https://visitiran.com/logo.png",
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description: "Discover Iran with guided tours. Ancient history, stunning architecture, desert adventures, and more.",
    sameAs: [
      "https://facebook.com/visitiran",
      "https://twitter.com/visitiran",
      "https://instagram.com/visitiran",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+98-21-1234-5678",
      contactType: "customer service",
      availableLanguage: ["English", "Farsi"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface TourSchemaProps {
  name: string;
  description: string;
  price: number;
  currency?: string;
  rating: number;
  reviewCount: number;
  duration: string;
  url: string;
}

export function TourSchema({
  name,
  description,
  price,
  currency = "USD",
  rating,
  reviewCount,
  duration,
  url,
}: TourSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name,
    description,
    url,
    touristType: "International Traveler",
    itinerary: {
      "@type": "ItemList",
      numberOfItems: parseInt(duration),
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01T00:00:00Z",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQSchemaProps {
  questions: { question: string; answer: string }[];
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
