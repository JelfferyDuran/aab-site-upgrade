import Image from "next/image";
import Link from "next/link";
import { getAllProductSlugs, getProductBySlug } from "@/lib/data";
import ScrollSlide, { ScrollFade } from "@/components/scroll";
import GalleryCarousel from "@/components/GalleryCarousel";

export async function generateStaticParams() {
  return getAllProductSlugs().map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/products" className="text-indigo-600 hover:underline">Back to Products</Link>
        </div>
      </div>
    );
  }

  const { title, body, images } = product;

  return (
    <div className="flex flex-col pt-16 lg:pt-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-indigo-600 hover:underline">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-indigo-600 hover:underline">Products</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 truncate max-w-[300px]">{title}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <ScrollSlide direction="left" duration={0.8}>
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl bg-gray-100">
                {images.length > 0 ? (
                  <Image
                    src={images[0].startsWith("http") || images[0].startsWith("/") ? images[0] : `https://images.editor.website${images[0]}`}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                  </div>
                )}
              </div>
            </ScrollSlide>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <ScrollSlide direction="right" duration={0.8}>
                <h1 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                  {title}
                </h1>
              </ScrollSlide>

              {body && (
                <ScrollFade delay={0.15}>
                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">{body}</p>
                </ScrollFade>
              )}

              <ScrollFade delay={0.25}>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">Available at All Aspects Barn</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-gray-700">In-store pickup only</span>
                  </div>
                </div>
              </ScrollFade>

              <ScrollSlide direction="up" delay={0.35}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={`mailto:allaspectsrecycled@gmail.com?subject=${encodeURIComponent(`Product inquiry: ${title}`)}`}
                    className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-all"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Inquire Now
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold rounded-full transition-all"
                  >
                    Visit Us
                  </Link>
                </div>
              </ScrollSlide>
            </div>
          </div>

          {/* Additional Images */}
          {images.length > 1 && (
            <div className="mt-16">
              <ScrollSlide direction="left">
                <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                  More Images
                </h2>
              </ScrollSlide>
              <GalleryCarousel
                images={images.slice(1).map((img, i) => ({
                  src: img.startsWith("http") || img.startsWith("/") ? img : `https://images.editor.website${img}`,
                  alt: `${title} — image ${i + 2}`,
                }))}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.title} | All Aspects Barn`,
    description: product.body?.slice(0, 160) || "Shop unique finds at All Aspects Barn.",
  };
}
