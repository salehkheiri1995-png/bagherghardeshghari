import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VisitIran - Discover the Beauty of Iran",
    template: "%s | VisitIran",
  },
  description:
    "Explore Iran with guided tours. Discover ancient Persepolis, Isfahan's architecture, desert adventures, and more. Book your Iran tour today.",
  keywords: [
    "Iran tourism",
    "Iran tours",
    "Visit Iran",
    "travel to Iran",
    "Persepolis",
    "Isfahan",
    "Iran adventure",
  ],
  openGraph: {
    title: "VisitIran - Discover the Beauty of Iran",
    description:
      "Explore Iran with guided tours. Ancient history, stunning architecture, desert adventures.",
    url: "https://visitiran.com",
    siteName: "VisitIran",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
