import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageByRoute } from "@/lib/data";
import ScrollSlide, { ScrollFade, ScrollScale } from "@/components/scroll";
import { Stagger, StaggerItem } from "@/components/motion";

export default async function InteriorPage({ params }: { params: Promise<{ route: string[] }> }) {
  const { route } = await params;
  const routePath = route ? route.join('/') : '';
  const page = getPageByRoute(routePath);

  if (!page) {
    notFound();
  }

  const { title, body, images, og_description } = page;

  return (
    <div className="flex flex-col pt-16 lg:pt-20">
      {/* Hero */}
      <ScrollScale delay={0.1}>
        <section className="relative py-24 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              {title}
            </h1>
            {og_description && (
              <ScrollFade delay={0.2}>
                <p className="text-xl text-indigo-200 max-w-3xl mx-auto">{og_description}</p>
              </ScrollFade>
            )}
          </div>
        </section>
      </ScrollScale>

      {/* Content */}
      <ScrollFade delay={0.15}>
        <section className="py-16 bg-white">
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

      {/* Image Gallery */}
      {images.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollSlide direction="left" className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                Gallery
              </h2>
            </ScrollSlide>

            <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {images.map((img, i) => (
                <StaggerItem key={i}>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group">
                    <Image
                      src={img.startsWith("/") ? img : img.replace(/^https?:\/\/images\.editor\.website/i, "")}
                      alt={`${title} - image ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* CTA */}
      <ScrollSlide direction="up" className="py-16 bg-gray-50">
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
              href="https://wa.me/12019897108?text=Hi! I have a question about All Aspects Barn."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold rounded-full transition-all"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </ScrollSlide>
    </div>
  );
}
