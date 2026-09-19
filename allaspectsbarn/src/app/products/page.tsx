import Image from "next/image";
import GlassPanel from "@/components/GlassPanel";
import ProductExplorer from "@/components/ProductExplorer";
import findsJson from "@/data/finds.json";
import { getCatalogPage, getProductCount } from "@/lib/catalog";

const findsData = findsJson as { src: string; alt: string; category: string }[];

export default function ProductsPage() {
  const productCount = getProductCount();
  const initialPage = getCatalogPage({ page: 1, perPage: 30 });

  return (
    <div className="flex flex-col pt-16 lg:pt-20">
      <section className="relative py-20 overflow-hidden bg-neutral-950">
        <Image
          src="/images/barn-hero-sunset.webp"
          alt="The shop at All Aspects at the Barn glowing at sunset"
          fill
          priority
          quality={78}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GlassPanel className="mx-auto max-w-3xl px-6 py-9 sm:px-12 sm:py-12">
            <h1
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Our Products
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
              Browse {productCount.toLocaleString()} unique finds — from vintage furniture to
              handcrafted goods.
            </p>
          </GlassPanel>
        </div>
      </section>

      <ProductExplorer initialPage={initialPage} />

      {findsData.length > 0 && (
        <section className="py-16 aab-band-warm-light border-t aab-line-warm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                From the Shop Floor
              </h2>
              <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
                Real finds photographed at the barn — come see them in person.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {findsData.map((img) => (
                <div
                  key={img.src}
                  className="relative aspect-square rounded-xl overflow-hidden shadow-md bg-[var(--aab-cream)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
