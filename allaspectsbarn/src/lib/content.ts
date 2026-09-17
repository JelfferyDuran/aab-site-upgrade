import pagesData from "@/data/pages.json";

export type ContentPage = {
  title: string;
  route: string;
  og_title: string;
  og_description: string;
  body: string;
  images: string[];
  sections: string[];
};

export const pages = pagesData as ContentPage[];

function normalizeRoute(route: string): string {
  return route.trim().replace(/^\/+|\/+$/g, "");
}

export function getPageByRoute(route: string): ContentPage | undefined {
  const normalized = normalizeRoute(route);
  return pages.find((page) => normalizeRoute(page.route) === normalized);
}

export function getContentRoutes(): string[] {
  const seen = new Set<string>();
  const routes: string[] = [];

  for (const page of pages) {
    const route = normalizeRoute(page.route || "");
    if (!route || route === "home") continue;
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(route)) continue;
    if (seen.has(route)) continue;

    seen.add(route);
    routes.push(`/${route}`);
  }

  return routes;
}

export function getContentPageCount(): number {
  return pages.length;
}
