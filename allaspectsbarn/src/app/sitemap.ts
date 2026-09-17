import type { MetadataRoute } from "next";
import products from "@/data/products.json";
import pages from "@/data/pages.json";

const SITE_URL = "https://allaspectsbarn.vercel.app";

/** Static app-router routes that are real pages (not catch-all fallbacks). */
const STATIC_ROUTES = [
  "",
  "/about",
  "/barn-brew-coffee-bar",
  "/contact",
  "/gallery",
  "/pavilion-party-rental",
  "/petting-farm",
  "/shop",
  "/wedding-venue",
  "/workshops",
  "/products",
  "/privacy",
  "/terms",
];

/** Catch-all routes served from pages.json — deduped, excludes junk GUID routes. */
function contentRoutes(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of pages as Array<{ route?: string }>) {
    const r = (p?.route ?? "").trim();
    if (!r) continue;
    if (r === "home") continue; // already the root
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(r)) continue; // broken GUID routes
    if (seen.has(r)) continue;
    seen.add(r);
    out.push("/" + r.replace(/^\/+/, ""));
  }
  return out;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const core: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r}`,
    lastModified,
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority: r === "" ? 1 : r === "/products" ? 0.9 : 0.8,
  }));

  const content: MetadataRoute.Sitemap = contentRoutes().map((r) => ({
    url: `${SITE_URL}${r}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = (products as Array<{ slug?: string }>)
    .filter((p) => !!p?.slug)
    .map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  return [...core, ...content, ...productPages];
}
