import Link from "next/link";
import Image from "next/image";
import Accordion, { AccordionItem } from "@/components/Accordion";
import { Reveal } from "@/components/motion";
import ScrollSlide from "@/components/scroll";
import OfferShowcase from "@/components/OfferShowcase";
import GalleryCarousel from "@/components/GalleryCarousel";
import GlassPanel from "@/components/GlassPanel";
import HomeVisitPlanner from "@/components/HomeVisitPlanner";
import galleryData from "@/data/gallery.json";
import { SITE } from "@/lib/site";

const HOME_GALLERY = (galleryData as { src: string; alt: string; category?: string }[]).slice(0, 8);

const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  SITE.address.display,
)}`;

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative min-h-[94vh] overflow-hidden bg-neutral-950">
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
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[94vh] w-full max-w-7xl items-center px-4 pb-28 pt-28 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-3xl text-left text-white">
              <Reveal direction="up" duration={0.7}>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/85 backdrop-blur-md sm:text-xs">
                  <span className="h-2 w-2 rounded-full bg-amber-300" />
                  Mount Bethel, Pennsylvania
                </div>
              </Reveal>

              <Reveal direction="up" delay={0.08} duration={0.8}>
                <h1
                  className="text-5xl font-bold leading-[0.94] tracking-[-0.035em] sm:text-7xl lg:text-[5.6rem]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  More than a barn.
                  <span className="mt-2 block font-display text-[0.72em] font-normal tracking-normal text-amber-200">
                    It&apos;s a whole afternoon.
                  </span>
                </h1>
              </Reveal>

              <Reveal direction="up" delay={0.18} duration={0.8}>
                <p className="mt-7 max-w-2xl text-base leading-7 text-white/82 sm:text-xl sm:leading-8">
                  Antiques, events, a petting farm, and Barn Brew — all together at All Aspects at the Barn.
                </p>
              </Reveal>

              <Reveal direction="up" delay={0.28} duration={0.8}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#plan-your-visit"
                    className="inline-flex items-center justify-center rounded-full bg-amber-300 px-7 py-4 font-semibold text-indigo-950 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-200"
                  >
                    Plan Your Visit
                  </a>
                  <a
                    href="#what-we-offer"
                    className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/[0.08] px-7 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-stone-900"
                  >
                    Explore the Barn
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal direction="left" delay={0.18} duration={0.8}>
              <GlassPanel className="ml-auto w-full max-w-md px-6 py-7 text-left sm:px-8 sm:py-8">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-indigo-700">
                  Visit information
                </p>
                <h2 className="mt-2 font-serif text-3xl text-stone-900">Come wander for a while.</h2>

                <div className="mt-6 divide-y divide-stone-900/10 rounded-2xl border border-stone-900/10 bg-white/45 px-5">
                  <div className="py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Hours</p>
                    <p className="mt-1 text-sm leading-6 text-stone-800">{SITE.hours.display}</p>
                  </div>
                  <div className="py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Find us</p>
                    <p className="mt-1 text-sm leading-6 text-stone-800">{SITE.address.display}</p>
                  </div>
                  <div className="py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Call</p>
                    <a href={SITE.phone.href} className="mt-1 inline-block text-sm font-semibold text-indigo-700 hover:text-indigo-900">
                      {SITE.phone.display}
                    </a>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <a
                    href={DIRECTIONS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-indigo-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-800"
                  >
                    Directions
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full border border-stone-900/15 px-4 py-3 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-900 hover:text-white"
                  >
                    Contact
                  </Link>
                </div>
              </GlassPanel>
            </Reveal>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/15 bg-stone-950/55 backdrop-blur-xl">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
            {[
              ["Browse", "Vintage & reclaimed finds"],
              ["Celebrate", "Barn & pavilion events"],
              ["Meet", "Family-friendly animals"],
              ["Sip", "Coffee at Barn Brew"],
            ].map(([label, copy]) => (
              <div key={label} className="px-3 py-4 text-center sm:px-5 sm:py-5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-amber-200">{label}</p>
                <p className="mt-1 text-xs text-white/72 sm:text-sm">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OfferShowcase />

      <HomeVisitPlanner />

      <section className="py-20 aab-band-warm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollSlide direction="right" className="text-center mb-10">
            <p className="font-display text-2xl text-amber-700/90">a look around</p>
            <h2 className="mt-1 text-4xl font-bold text-gray-900" style={{ fontFamily: "var(--font-playfair)" }}>
              The Barn in Pictures
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-stone-600">
              A glimpse of the shop, grounds, events, and everyday details that make the property feel different in person.
            </p>
          </ScrollSlide>

          <GalleryCarousel images={HOME_GALLERY} variant="strip" />

          <ScrollSlide direction="up" className="text-center mt-10">
            <Link
              href="/gallery"
              className="inline-flex items-center rounded-full bg-indigo-700 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-indigo-800"
            >
              View Full Gallery
            </Link>
          </ScrollSlide>
        </div>
      </section>

      <section className="py-20 aab-band-warm-light">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ScrollSlide direction="up" className="text-center mb-12">
            <p className="font-display text-2xl text-amber-700/90">before you come</p>
            <h2 className="mt-1 text-4xl font-bold text-gray-900" style={{ fontFamily: "var(--font-playfair)" }}>
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
                <p>Yes &mdash; family-friendly animal encounters, all ages welcome.</p>
              </AccordionItem>

              <AccordionItem question="What is Barn Brew?">
                <p>Our specialty coffee bar at the barn: espresso, cold brew, teas, and local baked goods.</p>
              </AccordionItem>

              <AccordionItem question="How do I book an event or visit?">
                <p>
                  Use our{" "}
                  <Link href="/contact" className="text-indigo-600 underline hover:text-indigo-800">
                    contact page
                  </Link>
                  , call {SITE.phone.display}, or email {SITE.email}. For events, book early to secure your date.
                </p>
              </AccordionItem>

              <AccordionItem question="Do you offer delivery or shipping for antique items?">
                <p>
                  Delivery is available for many pieces, depending on your location and the item&apos;s size. Contact us for details and pricing.
                </p>
              </AccordionItem>

              <AccordionItem question="What are your hours of operation?">
                <p>{SITE.hours.display}.</p>
              </AccordionItem>
            </Accordion>
          </ScrollSlide>
        </div>
      </section>

      <section className="relative overflow-hidden bg-stone-950 py-20 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(70% 100% at 0% 100%, rgba(67,82,152,0.55) 0%, rgba(67,82,152,0) 68%), radial-gradient(55% 85% at 100% 0%, rgba(245,158,11,0.16) 0%, rgba(245,158,11,0) 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <ScrollSlide direction="right">
              <div className="h-full rounded-[2rem] border border-white/12 bg-white/[0.06] p-8 sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">For a day out</p>
                <h2 className="mt-3 font-serif text-4xl">Come see the barn in person.</h2>
                <p className="mt-4 max-w-lg leading-7 text-white/70">
                  Browse the shop, visit the animals, grab coffee, and get a feel for the property beyond the photos.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={DIRECTIONS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-amber-300 px-6 py-3.5 font-semibold text-indigo-950 hover:bg-amber-200"
                  >
                    Get Directions
                  </a>
                  <a
                    href={SITE.phone.href}
                    className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white hover:bg-white hover:text-stone-950"
                  >
                    Call {SITE.phone.display}
                  </a>
                </div>
              </div>
            </ScrollSlide>

            <ScrollSlide direction="left" delay={0.08}>
              <div className="h-full rounded-[2rem] border border-white/12 bg-indigo-700/45 p-8 sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">For a celebration</p>
                <h2 className="mt-3 font-serif text-4xl">Picture your event here.</h2>
                <p className="mt-4 max-w-lg leading-7 text-white/74">
                  Talk through the date, guest experience, and which part of the property fits what you are planning.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 font-semibold text-indigo-800 hover:bg-amber-100"
                  >
                    Start an Inquiry
                  </Link>
                  <Link
                    href="/pavilion-party-rental"
                    className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white hover:bg-white hover:text-indigo-900"
                  >
                    See Event Spaces
                  </Link>
                </div>
              </div>
            </ScrollSlide>
          </div>
        </div>
      </section>
    </div>
  );
}
