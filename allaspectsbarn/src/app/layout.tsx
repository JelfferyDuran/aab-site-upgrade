import type { Metadata } from "next";
import { Cardo, Dancing_Script, Playfair_Display } from "next/font/google";
import SiteLayout from "@/components/SiteLayout";
import { SITE, SITE_URL } from "@/lib/site";
import "./tokens.css";
import "./globals.css";

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

const META_TITLE = `${SITE.shortName} — Events, Classes & Unique Finds`;
const META_DESCRIPTION =
  `${SITE.shortName} — premium event venue, chalk paint classes, and 2,700+ unique vintage & repurposed finds. Located on Route 611, Upper Mount Bethel, PA.`;
const SHARE_DESCRIPTION =
  "Premium event venue, chalk paint classes, and 2,700+ unique vintage & repurposed finds.";
const HERO_IMAGE = "/images/barn-hero-sunset.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: META_TITLE,
    template: `%s | ${SITE.shortName}`,
  },
  description: META_DESCRIPTION,
  keywords: [
    "barn events",
    "wedding venue",
    "chalk paint classes",
    "vintage furniture",
    "repurposed goods",
    SITE.shortName,
  ],
  alternates: {
    canonical: new URL(SITE_URL),
  },
  openGraph: {
    title: META_TITLE,
    description: SHARE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE.shortName,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: HERO_IMAGE,
        width: 1280,
        height: 960,
        alt: `${SITE.shortName} storefront on Route 611 in Upper Mount Bethel, PA`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: SHARE_DESCRIPTION,
    images: [
      {
        url: HERO_IMAGE,
        alt: `${SITE.shortName} storefront on Route 611 in Upper Mount Bethel, PA`,
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "EventVenue", "Store"],
  "@id": `${SITE_URL}/#business`,
  name: SITE.name,
  url: SITE_URL,
  description:
    "Premium event venue, chalk paint classes, and 2,700+ unique vintage & repurposed finds in Mount Bethel, PA.",
  image: `${SITE_URL}${HERO_IMAGE}`,
  telephone: SITE.phone.e164,
  email: SITE.email,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: SITE.geo.latitude,
    longitude: SITE.geo.longitude,
  },
  openingHours: [...SITE.hours.schema],
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
  sameAs: Object.values(SITE.social),
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
