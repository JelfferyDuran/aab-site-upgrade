"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import ScrollSlide, { ScrollFade } from "@/components/scroll";
import SwivelCard from "@/components/SwivelCard";
import galleryData from "@/data/gallery.json";

interface GalleryImage {
  src: string;
  alt: string;
  category?: string;
}

const ALL_CATEGORIES: string[] = ["All", ...Array.from(new Set(galleryData.map((img: GalleryImage) => img.category).filter((c): c is string => Boolean(c))))];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const reduce = useReducedMotion();

  const filteredImages: GalleryImage[] =
    activeCategory === "All"
      ? galleryData
      : galleryData.filter((img: GalleryImage) => img.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/IMG_1280.jpg')] bg-cover bg-center" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollSlide direction="up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Gallery
            </h1>
          </ScrollSlide>
          <ScrollFade delay={0.2}>
            <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto">
              A peek inside our barn, our finds, and the life we&apos;ve built around repurposed treasures.
            </p>
          </ScrollFade>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-indigo-900 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Swivel Card Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {reduce ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredImages.map((img: GalleryImage, i: number) => (
              <SwivelCard
                key={`${img.src}-${i}`}
                src={img.src}
                alt={img.alt}
                index={i}
                total={filteredImages.length}
                category={img.category}
              />
            ))}
          </div>
        ) : (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredImages.map((img: GalleryImage, i: number) => (
              <SwivelCard
                key={`${img.src}-${i}`}
                src={img.src}
                alt={img.alt}
                index={i}
                total={filteredImages.length}
                category={img.category}
              />
            ))}
          </motion.div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-indigo-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollSlide direction="up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Want to Visit?
            </h2>
          </ScrollSlide>
          <ScrollFade delay={0.15}>
            <p className="text-indigo-200 text-lg mb-8">
              Come see the barn in person. Reach out to plan your visit.
            </p>
          </ScrollFade>
          <ScrollSlide direction="up" delay={0.25}>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:bg-indigo-100 transition-colors shadow-xl hover:shadow-2xl"
            >
              Get in Touch
            </Link>
          </ScrollSlide>
        </div>
      </section>
    </div>
  );
}
