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

export const metadata: Metadata = {
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
  openGraph: {
    title: "All Aspects Barn — Events, Classes & Unique Finds",
    description:
      "Premium event venue, chalk paint classes, and 2,700+ unique vintage & repurposed finds.",
    url: "https://allaspectsbarn.vercel.app",
    siteName: "All Aspects Barn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Aspects Barn — Events, Classes & Unique Finds",
    description:
      "Premium event venue, chalk paint classes, and 2,700+ unique vintage & repurposed finds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cardo.variable} ${playfair.variable} ${dancing.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
