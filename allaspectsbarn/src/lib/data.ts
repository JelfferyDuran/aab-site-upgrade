import pagesData from "@/data/pages.json";
import productsData from "@/data/products.json";

export type Page = {
  title: string;
  route: string;
  og_title: string;
  og_description: string;
  body: string;
  images: string[];
  sections: string[];
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  url: string;
  theme_color: string;
  body: string;
  images: string[];
};

export const pages: Page[] = pagesData as Page[];
export const products: Product[] = productsData as Product[];

export function getPageByRoute(route: string): Page | undefined {
  return pages.find((p) => p.route === route);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug || p.id === slug);
}

export function getAllProductSlugs(): { slug: string }[] {
  return products
    .filter((p) => p.slug && p.slug !== "undefined" && p.slug !== "null")
    .map((p) => ({ slug: p.slug }));
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.body.toLowerCase().includes(q)
  );
}

export function getProductsPage(page: number, perPage: number = 24): Product[] {
  const start = (page - 1) * perPage;
  return products.slice(start, start + perPage);
}

export function getTotalProductPages(perPage: number = 24): number {
  return Math.ceil(products.length / perPage);
}
