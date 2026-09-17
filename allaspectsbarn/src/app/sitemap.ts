import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/catalog";
import { getContentRoutes } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const core: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/products" ? 0.9 : 0.8,
  }));

  const content: MetadataRoute.Sitemap = getContentRoutes().map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = getAllProductSlugs().map(({ slug }) => ({
    url: `${SITE_URL}/products/${slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...core, ...content, ...productPages];
}
