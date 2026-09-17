/**
 * Compatibility exports for older imports.
 *
 * New code should import from `@/lib/content` or `@/lib/catalog` directly so
 * page/content concerns and catalog concerns stay independently replaceable.
 */
export {
  getContentPageCount,
  getContentRoutes,
  getPageByRoute,
} from "@/lib/content";
export type { ContentPage as Page } from "@/lib/content";

export {
  getAllProductSlugs,
  getCatalogPage,
  getProductBySlug,
  getProductCount,
} from "@/lib/catalog";
export type { CatalogPage, Product, ProductCard } from "@/lib/catalog";
