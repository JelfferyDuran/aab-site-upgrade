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
  title: "All Aspects Barn — Premium Event Venue",
  description:
    "A premium barn event venue for weddings, celebrations, and gatherings. Elegance meets rustic charm.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
