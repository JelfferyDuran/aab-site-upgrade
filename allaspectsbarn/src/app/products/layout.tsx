import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Catalog",
  description:
    "Browse the full inventory at All Aspects at the Barn — 2,700+ vintage, antique and repurposed finds with photos, on Route 611 in Upper Mount Bethel, PA.",
  alternates: { canonical: "/products" },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
