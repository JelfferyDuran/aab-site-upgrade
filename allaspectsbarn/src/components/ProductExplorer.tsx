"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CatalogPage, ProductCard } from "@/lib/catalog";

type ProductExplorerProps = {
  initialPage: CatalogPage;
};

function ProductTile({ product }: { product: ProductCard }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group aab-card-warm rounded-2xl overflow-hidden block transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/40"
    >
      <div className="relative aspect-square bg-[rgb(249_240_226)]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300" aria-hidden="true">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3
          className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {product.title}
        </h3>
        {product.body && <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.body}</p>}
      </div>
    </Link>
  );
}

export default function ProductExplorer({ initialPage }: ProductExplorerProps) {
  const [query, setQuery] = useState(initialPage.query);
  const [catalog, setCatalog] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const didMountRef = useRef(false);

  const loadPage = useCallback(async (nextPage: number, nextQuery: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(initialPage.perPage),
      });
      if (nextQuery.trim()) params.set("q", nextQuery.trim());

      const response = await fetch(`/api/products?${params.toString()}`, {
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);

      const nextCatalog = (await response.json()) as CatalogPage;
      setCatalog(nextCatalog);
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") return;
      setError("We could not refresh the catalog. Please try again.");
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setLoading(false);
      }
    }
  }, [initialPage.perPage]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      void loadPage(1, query);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query, loadPage]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const goToPage = (nextPage: number) => {
    void loadPage(nextPage, query);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto mt-8">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <div className="relative">
          <input
            id="product-search"
            type="search"
            autoComplete="off"
            placeholder="Search products..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full px-6 py-4 pl-14 text-lg rounded-full border-0 shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-400/50"
          />
          <svg
            className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <p className="mt-3 min-h-6 text-sm text-stone-700" aria-live="polite">
          {loading
            ? "Searching…"
            : query.trim()
              ? `${catalog.total.toLocaleString()} result${catalog.total === 1 ? "" : "s"} for “${catalog.query}”`
              : `${catalog.total.toLocaleString()} products`}
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
      </div>

      <section className="py-16 aab-band-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {catalog.items.length > 0 ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-opacity duration-200 ${loading ? "opacity-60" : "opacity-100"}`}
              aria-busy={loading}
            >
              {catalog.items.map((product) => (
                <ProductTile key={product.id || product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <h2 className="text-2xl font-semibold text-stone-900">No matching products</h2>
              <p className="mt-2 text-stone-600">Try a broader word or clear the search.</p>
            </div>
          )}

          {catalog.totalPages > 1 && (
            <nav className="mt-12 flex justify-center items-center gap-2" aria-label="Product pages">
              <button
                type="button"
                onClick={() => goToPage(catalog.page - 1)}
                disabled={loading || catalog.page === 1}
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-indigo-500 transition-all"
              >
                ← Prev
              </button>
              <span className="px-4 py-2 text-gray-700" aria-current="page">
                Page {catalog.page} of {catalog.totalPages}
              </span>
              <button
                type="button"
                onClick={() => goToPage(catalog.page + 1)}
                disabled={loading || catalog.page === catalog.totalPages}
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-indigo-500 transition-all"
              >
                Next →
              </button>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
