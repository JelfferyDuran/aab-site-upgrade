/**
 * Compatibility exports for older imports.
 *
 * New code should import from `@/lib/content` or `@/lib/catalog` directly so
 * page/content concerns and catalog concerns stay independently replaceable.
 * Do not import `products` into a Client Component.
 */
export {
  getContentPageCount,
  getContentRoutes,
  getPageByRoute,
  pages,
} from "@/lib/content";
export type { ContentPage as Page } from "@/lib/content";

export {
  getAllProductSlugs,
  getCatalogPage,
  getProductBySlug,
  getProductCount,
  getProductsPage,
  getTotalProductPages,
  products,
  searchProducts,
} from "@/lib/catalog";
export type { CatalogPage, Product, ProductCard } from "@/lib/catalog";
