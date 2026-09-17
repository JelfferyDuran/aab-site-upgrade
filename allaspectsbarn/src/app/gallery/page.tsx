"use client";

import { useState } from "react";
import Image from "next/image";
import GlassPanel from "@/components/GlassPanel";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import GalleryCarousel from "@/components/GalleryCarousel";
import galleryData from "@/data/gallery.json";

interface GalleryImage {
  src: string;
  alt: string;
  category?: string;
}

const ALL_CATEGORIES: string[] = [
  "All",
  ...Array.from(new Set(galleryData.map((img: GalleryImage) => img.category).filter((c): c is string => Boolean(c)))),
];

export default function GalleryPage() {
  const reduce = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredImages: GalleryImage[] =
    activeCategory === "All"
      ? (galleryData as GalleryImage[])
      : (galleryData as GalleryImage[]).filter((img) => img.category === activeCategory);

  return (
    <div className="flex flex-col pt-16 lg:pt-20">
      {/* Hero — the barn photo is the attraction; neutral scrim only, zero hue shift */}
      <section className="relative min-h-[52vh] md:min-h-[60vh] flex items-end overflow-hidden bg-neutral-950">
        <Image
          src="/images/barn-hero-sunset.webp"
          alt="The shop at All Aspects at the Barn glowing at sunset"
          fill
          priority
          fetchPriority="high"
          quality={78}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/60" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
          <GlassPanel className="inline-block px-6 py-5 sm:px-9 sm:py-7">
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.7, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-stone-900"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Gallery
            </motion.h1>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.12, ease: "easeOut" }}
              className="mt-2 text-base sm:text-lg text-stone-700"
              style={{ fontFamily: "var(--font-cardo)" }}
            >
              Life at the barn.
            </motion.p>
          </GlassPanel>
        </div>
      </section>

      {/* Filters */}
      <section className="aab-glass-warm border-b border-[rgb(246_232_214)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap gap-2 justify-center">
          {ALL_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeCategory === category
                  ? "bg-neutral-900 text-white"
                  : "bg-[rgb(249_240_226)] text-stone-700 hover:bg-[rgb(245_232_214)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Contained viewer — every photo lives in one stage, no scroll-per-picture */}
      <section className="aab-band-warm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <GalleryCarousel images={filteredImages} key={activeCategory} />
        </div>
      </section>

      {/* Compact invitation */}
      <section className="py-14 bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
            Come see it in person
          </h2>
          <p className="text-indigo-200 mb-7">
            1584 S Delaware Road, Mount Bethel, PA &middot; Tue&ndash;Sat 8&ndash;5 &middot; Sun 9&ndash;5 &middot; Mon closed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+15705832305"
              className="inline-flex items-center justify-center px-8 py-4 bg-amber-500 hover:bg-amber-400 text-indigo-950 font-semibold rounded-full transition-all duration-300"
            >
              (570) 583-2305
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-indigo-900 font-semibold rounded-full transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
