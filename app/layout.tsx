import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
});

// Clean sans for descriptions, labels, nav and form fields on the light inner
// pages — Cormorant is beautiful for names and headings but too thin to read
// comfortably at small sizes on a light background.
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

// Absolute base so relative OG/Twitter image paths resolve to full URLs
// (link-preview crawlers need absolute URLs). Set NEXT_PUBLIC_SITE_URL to the
// real domain once there is one; on Vercel the production URL is used otherwise.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const description =
  "AHADU — an all-day restaurant and cafe in Bole, Addis Ababa. Browse the menu, see the room, and reserve a table.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AHADU — Restaurant & Cafe, Addis Ababa", template: "%s · AHADU" },
  description,
  openGraph: {
    type: "website",
    siteName: "AHADU",
    title: "AHADU — Restaurant & Cafe, Addis Ababa",
    description,
    url: "/",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "AHADU" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AHADU — Restaurant & Cafe, Addis Ababa",
    description,
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
