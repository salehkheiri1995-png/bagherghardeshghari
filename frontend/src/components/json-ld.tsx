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
    description:
      "Discover Iran with guided tours. Ancient history, stunning architecture, desert adventures, and more.",
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

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VisitIran",
    url: "https://visitiran.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://visitiran.com/tours?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
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
  image?: string;
  province?: string;
  slug?: string;
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
  image,
  province,
  slug,
}: TourSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name,
    description,
    url,
    ...(image ? { image } : {}),
    provider: {
      "@type": "TravelAgency",
      name: "VisitIran - باقر گردشگری",
      url: "https://visitiran.com",
    },
    touristType: {
      "@type": "Audience",
      audienceType: "International Travelers",
    },
    itinerary: {
      "@type": "ItemList",
      numberOfItems: parseInt(duration),
      name: `${duration}-Day ${name} Itinerary`,
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
      url,
      seller: {
        "@type": "Organization",
        name: "VisitIran",
      },
    },
    ...(reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.toFixed(1),
            reviewCount,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    ...(province
      ? {
          location: {
            "@type": "Place",
            name: province,
            address: {
              "@type": "PostalAddress",
              addressCountry: "IR",
              addressRegion: province,
            },
          },
        }
      : {}),
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
