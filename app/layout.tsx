import "./globals.css";
import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Lato } from "next/font/google";

// Cinzel: the brand voice — logo, nav, eyebrows, category headers, buttons.
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
  display: "swap",
});

// Cormorant Garamond: headlines, dish names, pull quotes (regular + italic).
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// Lato: descriptions, prices, tags, form fields, small print. Cormorant is too
// thin to read comfortably at small sizes. (Lato ships 300/400/700 only —
// there is no 500 — so "medium" uses 400 plus tabular numerals.)
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-body",
  display: "swap",
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
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${lato.variable}`}>
      <body>{children}</body>
    </html>
  );
}
