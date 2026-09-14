"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";
import { motion } from "framer-motion";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 30;

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + perPage);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const firstWord = p.title.split(" ")[0] || "Other";
      counts[firstWord] = (counts[firstWord] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
  }, []);

  return (
    <div className="flex flex-col pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-5xl sm:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Products
          </motion.h1>
          <motion.p
            className="text-xl text-indigo-200 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Browse {products.length.toLocaleString()} unique finds — from vintage furniture to handcrafted goods.
          </motion.p>

          {/* Search */}
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-6 py-4 pl-14 text-lg rounded-full border-0 shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-400/50"
              />
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchQuery && (
              <motion.p
                className="mt-3 text-indigo-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Quick Filters */}
          <motion.div
            className="flex flex-wrap gap-2 mb-8 justify-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.05 }
              }
            }}
          >
            {categoryCounts.map(([cat, count]) => (
              <motion.button
                key={cat}
                onClick={() => {
                  setSearchQuery(cat);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-indigo-500 hover:text-indigo-600 transition-all"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat} <span className="text-gray-400">({count})</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.03 }
              }
            }}
          >
            {visibleProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md block"
                >
                  <div className="relative aspect-square bg-gray-100">
                    {product.images.length > 0 ? (
                      <Image
                        src={product.images[0].startsWith("http") ? product.images[0] : `https://images.editor.website${product.images[0]}`}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2" style={{ fontFamily: "var(--font-playfair)" }}>
                      {product.title}
                    </h3>
                    {product.body && (
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.body}</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              className="mt-12 flex justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-indigo-500 transition-all"
              >
                ← Prev
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-indigo-500 transition-all"
              >
                Next →
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
