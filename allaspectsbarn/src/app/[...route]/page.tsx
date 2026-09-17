import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageByRoute } from "@/lib/data";
import ScrollSlide, { ScrollFade, ScrollScale } from "@/components/scroll";
import GalleryCarousel from "@/components/GalleryCarousel";
import type { Metadata } from "next";

/* Per-route SEO. pages.json carries real og_title/og_description for some of the
   original pages; these fallbacks cover the ones it left blank, so no route
   inherits the site-wide default title. Titles omit the brand on purpose: the
   layout's title template appends "| All Aspects Barn" exactly once. */
const PAGE_SEO: Record<string, { title: string; description: string }> = {
  about: {
    title: "About",
    description:
      "All Aspects at the Barn is an antique, vintage and repurposed goods shop on Route 611 in Upper Mount Bethel, PA — with classes, a coffee bar and a petting farm.",
  },
  "petting-farm": {
    title: "Petting Farm",
    description:
      "Feed and meet the animals at the All Aspects at the Barn petting farm on Route 611 in Upper Mount Bethel, PA. Open Tue–Sat 8–5, Sun 9–5 (closed Monday).",
  },
  "wedding-venue": {
    title: "Wedding Venue",
    description:
      "A rustic barn and covered pavilion in Upper Mount Bethel, PA for weddings, receptions and private events. Call (570) 583-2305 for availability.",
  },
  workshops: {
    title: "Workshops",
    description:
      "Hands-on chalk paint and furniture workshops at All Aspects at the Barn in Upper Mount Bethel, PA. See what is coming up and get in touch to join.",
  },
  "pavilion-party-rental": {
    title: "Pavilion Party Rental",
    description:
      "Rent the covered pavilion at All Aspects at the Barn for birthday parties and family gatherings in Upper Mount Bethel, PA. Call (570) 583-2305.",
  },
  shop: {
    title: "Shop",
    description:
      "Shop Wise Owl Paint Company, Dixie Belle Paint Company and ClingOn brushes while being inspired by tutorial videos & gallery.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ route: string[] }> }): Promise<Metadata> {
  const { route } = await params;
  const routePath = route ? route.join("/") : "";
  const page = getPageByRoute(routePath);
  const fallback = PAGE_SEO[routePath];
  const title =
    fallback?.title ||
    (page?.og_title ? page.og_title.split("|")[0].trim() : "") ||
    page?.title ||
    "All Aspects at the Barn";
  const description =
    page?.og_description ||
    fallback?.description ||
    "All Aspects at the Barn — antique and repurposed finds, classes, coffee bar and petting farm on Route 611 in Upper Mount Bethel, PA.";
  return {
    title,
    description,
    alternates: { canonical: `/${routePath}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function InteriorPage({ params }: { params: Promise<{ route: string[] }> }) {
  const { route } = await params;
  const routePath = route ? route.join('/') : '';
  const page = getPageByRoute(routePath);

  if (!page) {
    notFound();
  }

  const { title, body, images, og_description } = page;

  // Same path normalisation the old image grid used (migrated local assets).
  const normalized = images.map((img) =>
    img.startsWith("/") ? img : img.replace(/^https?:\/\/images\.editor\.website/i, "")
  );
  const carouselImages = normalized.map((src, i) => ({ src, alt: `${title} — photo ${i + 1}` }));
  const heroSrc = normalized[0] ?? "";

  return (
    <div className="flex flex-col pt-16 lg:pt-20">
      {/* Hero — the page's own photograph carries it; neutral scrim, no hue shift */}
      <ScrollScale delay={0.1}>
        <section className={`relative py-24 md:py-28 overflow-hidden ${heroSrc ? "bg-neutral-950" : "bg-neutral-900"}`}>
          {heroSrc && (
            <>
              <Image
                src={heroSrc}
                alt={title}
                fill
                priority
                quality={72}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/45 to-black/75" />
            </>
          )}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              {title}
            </h1>
            {!body && og_description && (
              <ScrollFade delay={0.2}>
                <p className="text-xl text-white/85 max-w-3xl mx-auto">{og_description}</p>
              </ScrollFade>
            )}
          </div>
        </section>
      </ScrollScale>

      {/* Content */}
      <ScrollFade delay={0.15}>
        <section className="py-16 aab-band-warm-light">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {body && (
              <div className="prose prose-lg prose-indigo mx-auto">
                {body.split('\n').filter(Boolean).map((paragraph, i) => (
                  <ScrollSlide key={i} direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.05}>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {paragraph}
                    </p>
                  </ScrollSlide>
                ))}
              </div>
            )}
          </div>
        </section>
      </ScrollFade>

      {/* Image Gallery — one contained viewer instead of a scroll-through grid */}
      {carouselImages.length > 0 && (
        <section className="py-16 aab-band-warm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollSlide direction="left" className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "var(--font-playfair)" }}>
                Gallery
              </h2>
            </ScrollSlide>

            <GalleryCarousel images={carouselImages} />
          </div>
        </section>
      )}

      {/* CTA */}
      <ScrollSlide direction="up" className="py-16 aab-band-warm">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Visit Us
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We&apos;re located on Route 611 in the Village of Stone Church, Upper Mount Bethel, PA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-all"
            >
              Contact Us
            </Link>
            <a
              href="mailto:allaspectsrecycled@gmail.com?subject=Question%20about%20All%20Aspects%20at%20the%20Barn"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold rounded-full transition-all"
            >
              Email Us
            </a>
          </div>
        </div>
      </ScrollSlide>
    </div>
  );
}
