import Link from "next/link";
import Image from "next/image";
import Accordion, { AccordionItem } from "@/components/Accordion";
import { Reveal } from "@/components/motion";
import ScrollSlide from "@/components/scroll";
import OfferShowcase from "@/components/OfferShowcase";
import GalleryCarousel from "@/components/GalleryCarousel";
import GlassPanel from "@/components/GlassPanel";
import galleryData from "@/data/gallery.json";

const HOME_GALLERY = (galleryData as { src: string; alt: string; category?: string }[]).slice(0, 8);

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero — the barn photograph is the attraction. Neutral scrim only: no hue shift. */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-neutral-950">
        <div className="absolute inset-0">
          <Image
            src="/images/barn-hero-sunset.webp"
            alt="The shop at All Aspects at the Barn glowing at sunset"
            fill
            priority
            loading="eager"
            fetchPriority="high"
            quality={78}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
          />
          {/* Light neutral scrim only — the card below carries the contrast. */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/5 to-black/50" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Light glass card: gives the top info contrast against the photo. */}
          <GlassPanel className="px-6 py-10 sm:px-12 sm:py-14">
            <Reveal direction="up" duration={0.8}>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-5 tracking-tight"
                  style={{ fontFamily: "var(--font-playfair)" }}>
                All Aspects<br />
                <span className="text-amber-700">at the Barn</span>
              </h1>
            </Reveal>

            <Reveal direction="up" delay={0.2} duration={0.8}>
              <p className="text-sm sm:text-lg text-gray-700 uppercase tracking-[0.18em] max-w-2xl mx-auto mb-8"
                 style={{ fontFamily: "var(--font-cardo)" }}>
                Antiques &middot; Events &middot; Petting Farm &middot; Barn Brew
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.4} duration={0.8}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Explore Our Venue
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-900 text-gray-900 hover:bg-stone-900 hover:text-white font-semibold rounded-full transition-all duration-300"
                >
                  Book an Event
                </Link>
              </div>
            </Reveal>
          </GlassPanel>
        </div>

        {/* Scroll indicator */}
        <Reveal direction="up" delay={0.6}>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </Reveal>
      </section>

      {/* What We Offer — real cropped photographs, layered cards, one row on desktop */}
      <OfferShowcase />

      {/* Gallery Preview — contained viewer so nobody scrolls picture-by-picture */}
      <section className="py-20 aab-band-warm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollSlide direction="right" className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "var(--font-playfair)" }}>
              Our Space
            </h2>
          </ScrollSlide>

          <GalleryCarousel images={HOME_GALLERY} variant="strip" />

          <ScrollSlide direction="up" className="text-center mt-10">
            <Link
              href="/gallery"
              className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-all duration-300"
            >
              View Full Gallery
            </Link>
          </ScrollSlide>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 aab-band-warm-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollSlide direction="up" className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "var(--font-playfair)" }}>
              Frequently Asked Questions
            </h2>
          </ScrollSlide>

          <ScrollSlide direction="up" delay={0.1}>
            <Accordion>
              <AccordionItem question="What is All Aspects at the Barn?" defaultOpen={true}>
                <p>
                  A multi-faceted destination in Mount Bethel, Pennsylvania: antique store, gift shop, event venue, petting farm, and Barn Brew coffee.
                </p>
              </AccordionItem>

              <AccordionItem question="Do you host weddings and private events?">
                <p>
                  Yes &mdash; barn weddings, birthday parties, and corporate gatherings. Contact us to talk dates.
                </p>
              </AccordionItem>

              <AccordionItem question="What can I find in your antique store?">
                <p>
                  Vintage furniture, reclaimed pieces, refinished primitives, home decor, and one-of-a-kind finds. New inventory arrives regularly.
                </p>
              </AccordionItem>

              <AccordionItem question="Is the petting farm open to the public?">
                <p>
                  Yes &mdash; family-friendly animal encounters, all ages welcome.
                </p>
              </AccordionItem>

              <AccordionItem question="What is Barn Brew?">
                <p>
                  Our specialty coffee bar at the barn: espresso, cold brew, teas, and local baked goods.
                </p>
              </AccordionItem>

              <AccordionItem question="How do I book an event or visit?">
                <p>
                  Use our <Link href="/contact" className="text-indigo-600 hover:text-indigo-800 underline">contact page</Link>, call (570) 583-2305, or email allaspectsrecycled@gmail.com. For events, book early to secure your date.
                </p>
              </AccordionItem>

              <AccordionItem question="Do you offer delivery or shipping for antique items?">
                <p>
                  Delivery is available for many pieces, depending on your location and the item&apos;s size. Contact us for details and pricing.
                </p>
              </AccordionItem>

              <AccordionItem question="What are your hours of operation?">
                <p>
                  Tuesday&ndash;Saturday 8am&ndash;5pm, Sunday 9am&ndash;5pm, closed Monday.
                </p>
              </AccordionItem>
            </Accordion>
          </ScrollSlide>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollSlide direction="left">
            <h2 className="text-4xl font-bold mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
              Ready to Plan Your Event?
            </h2>
          </ScrollSlide>
          <ScrollSlide direction="up" delay={0.25}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-amber-500 hover:bg-amber-400 text-indigo-950 font-semibold rounded-full transition-all duration-300"
              >
                Get in Touch
              </Link>
              <a
                href="mailto:allaspectsrecycled@gmail.com?subject=Event%20inquiry%20%E2%80%94%20All%20Aspects%20at%20the%20Barn"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[var(--color-primary-900)] font-semibold rounded-full transition-all duration-300"
              >
                Email Us
              </a>
            </div>
          </ScrollSlide>
        </div>
      </section>
    </div>
  );
}
