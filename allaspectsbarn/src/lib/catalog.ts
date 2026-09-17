import productsData from "@/data/products.json";

export type Product = {
  id: string;
  title: string;
  slug: string;
  url: string;
  theme_color: string;
  body: string;
  images: string[];
};

export type ProductCard = Pick<Product, "id" | "title" | "slug"> & {
  body: string;
  image: string | null;
};

export type CatalogPage = {
  items: ProductCard[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  query: string;
};

const products = productsData as Product[];
const DEFAULT_PER_PAGE = 30;
const MAX_PER_PAGE = 60;

function clampInteger(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

function isRoutableSlug(slug: string | undefined): slug is string {
  return Boolean(slug && slug !== "undefined" && slug !== "null");
}

function normalizeImageSource(src: string | undefined): string | null {
  if (!src) return null;
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return `https://images.editor.website${src}`;
}

function summarizeBody(body: string): string {
  return body.replace(/\s+/g, " ").trim().slice(0, 220);
}

function toCard(product: Product): ProductCard {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    body: summarizeBody(product.body || ""),
    image: normalizeImageSource(product.images?.[0]),
  };
}

export function getProductCount(): number {
  return products.length;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug || product.id === slug);
}

export function getAllProductSlugs(): { slug: string }[] {
  const seen = new Set<string>();
  const slugs: { slug: string }[] = [];

  for (const product of products) {
    const slug = product.slug?.trim();
    if (!isRoutableSlug(slug) || seen.has(slug)) continue;
    seen.add(slug);
    slugs.push({ slug });
  }

  return slugs;
}

export function getCatalogPage(options: {
  query?: string;
  page?: number;
  perPage?: number;
} = {}): CatalogPage {
  const query = (options.query || "").trim().slice(0, 120);
  const normalizedQuery = query.toLocaleLowerCase();
  const perPage = clampInteger(options.perPage ?? DEFAULT_PER_PAGE, 1, MAX_PER_PAGE);

  const matches = normalizedQuery
    ? products.filter((product) => {
        const title = product.title.toLocaleLowerCase();
        const body = (product.body || "").toLocaleLowerCase();
        return title.includes(normalizedQuery) || body.includes(normalizedQuery);
      })
    : products;

  const total = matches.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = clampInteger(options.page ?? 1, 1, totalPages);
  const start = (page - 1) * perPage;

  return {
    items: matches.slice(start, start + perPage).map(toCard),
    page,
    perPage,
    total,
    totalPages,
    query,
  };
}
