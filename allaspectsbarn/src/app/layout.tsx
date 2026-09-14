import type { Metadata } from "next";
import { Inter, Playfair_Display, Abril_Fatface } from "next/font/google";
import "./tokens.css";
import "./globals.css";
import SiteLayout from "@/components/SiteLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const abril = Abril_Fatface({
  variable: "--font-abril",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
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
      className={`${inter.variable} ${playfair.variable} ${abril.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
