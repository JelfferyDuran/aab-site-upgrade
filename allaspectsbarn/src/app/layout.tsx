import type { Metadata } from "next";
import { Cardo, Playfair_Display, Dancing_Script } from "next/font/google";
import "./tokens.css";
import "./globals.css";
import SiteLayout from "@/components/SiteLayout";

const cardo = Cardo({
  variable: "--font-cardo",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://allaspectsbarn.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "All Aspects Barn — Events, Classes & Unique Finds",
    template: "%s | All Aspects Barn",
  },
  description:
    "All Aspects Barn — premium event venue, chalk paint classes, and 2,700+ unique vintage & repurposed finds. Located on Route 611, Upper Mount Bethel, PA.",
  keywords: [
    "barn events",
    "wedding venue",
    "chalk paint classes",
    "vintage furniture",
    "repurposed goods",
    "All Aspects Barn",
  ],
  alternates: {
    canonical: new URL(SITE_URL),
  },
  openGraph: {
    title: "All Aspects Barn — Events, Classes & Unique Finds",
    description:
      "Premium event venue, chalk paint classes, and 2,700+ unique vintage & repurposed finds.",
    url: SITE_URL,
    siteName: "All Aspects Barn",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/barn-hero-sunset.jpg",
        width: 1280,
        height: 960,
        alt: "All Aspects Barn storefront on Route 611 in Upper Mount Bethel, PA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Aspects Barn — Events, Classes & Unique Finds",
    description:
      "Premium event venue, chalk paint classes, and 2,700+ unique vintage & repurposed finds.",
    images: [
      {
        url: "/images/barn-hero-sunset.jpg",
        alt: "All Aspects Barn storefront on Route 611 in Upper Mount Bethel, PA",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "EventVenue", "Store"],
  "@id": `${SITE_URL}/#business`,
  name: "All Aspects at the Barn",
  url: SITE_URL,
  description:
    "Premium event venue, chalk paint classes, and 2,700+ unique vintage & repurposed finds in Mount Bethel, PA.",
  image: `${SITE_URL}/images/barn-hero-sunset.jpg`,
  telephone: "+1-570-583-2305",
  email: "allaspectsrecycled@gmail.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1584 S Delaware Road",
    addressLocality: "Mount Bethel",
    addressRegion: "PA",
    postalCode: "18343",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 40.8852894,
    longitude: -75.1235791,
  },
  openingHours: ["Tu-Sa 08:00-17:00", "Su 09:00-17:00"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "09:00",
      closes: "17:00",
    },
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Chalk Paint Classes",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Barn Event Venue Rental",
      },
    },
  ],
  sameAs: [
    "https://www.facebook.com/allaspectsrepurposed/",
    "https://www.linkedin.com/company/all-aspects-at-the-barn/",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cardo.variable} ${playfair.variable} ${dancing.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
