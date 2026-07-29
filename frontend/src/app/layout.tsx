import type { Metadata } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { WebsiteSchema } from "@/components/json-ld";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://visitiran.com"),
  title: {
    default: "VisitIran - Discover the Beauty of Iran | تور ایرانگردی",
    template: "%s | VisitIran",
  },
  description:
    "Explore Iran with expert guided tours. Discover Persepolis, Isfahan, Alborz mountains, Hyrcanian forests, and desert adventures. Book your Iran tour today.",
  keywords: [
    "Iran tourism",
    "Iran tours",
    "Visit Iran",
    "travel to Iran",
    "Persepolis tour",
    "Isfahan tour",
    "Iran adventure",
    "Iran hiking",
    "Iran nature tour",
    "تور ایران",
    "گردشگری ایران",
    "باقر گردشگری",
  ],
  authors: [{ name: "VisitIran", url: "https://visitiran.com" }],
  creator: "VisitIran",
  publisher: "VisitIran",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://visitiran.com",
    languages: {
      "en-US": "https://visitiran.com",
      "fa-IR": "https://visitiran.com/fa",
    },
  },
  openGraph: {
    title: "VisitIran - Discover the Beauty of Iran",
    description:
      "Explore Iran with guided tours. Ancient history, stunning architecture, desert adventures.",
    url: "https://visitiran.com",
    siteName: "VisitIran",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VisitIran - Beautiful landscapes of Iran",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VisitIran - Discover the Beauty of Iran",
    description:
      "Explore Iran with guided tours. Ancient history, stunning architecture, desert adventures.",
    images: ["/og-image.jpg"],
    site: "@visitiran",
    creator: "@visitiran",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${vazirmatn.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <WebsiteSchema />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
