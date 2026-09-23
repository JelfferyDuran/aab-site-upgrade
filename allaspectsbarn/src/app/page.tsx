import Link from "next/link";
import Image from "next/image";
import Accordion, { AccordionItem } from "@/components/Accordion";
import { Reveal } from "@/components/motion";
import ScrollSlide from "@/components/scroll";
import OfferShowcase from "@/components/OfferShowcase";
import galleryData from "@/data/gallery.json";

const HOME_GALLERY = (
  galleryData as { src: string; alt: string; category?: string }[]
).slice(0, 8);

const GALLERY_SHAPES = [
  "h-[28rem] rounded-t-[10rem] rounded-b-[2rem]",
  "h-[22rem] rounded-[2rem]",
  "h-[28rem] rounded-[999px]",
  "h-[24rem] rounded-t-[8rem] rounded-b-[2rem]",
  "h-[29rem] rounded-[2rem]",
  "h-[23rem] rounded-t-[999px] rounded-b-[2rem]",
  "h-[27rem] rounded-[999px]",
  "h-[24rem] rounded-[2rem]",
];

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-hidden">
      <section className="relative min-h-[96svh] overflow-hidden bg-neutral-950">
        <Image
          src="/images/barn-hero-sunset.webp"
          alt="The shop at All Aspects at the Barn glowing at sunset"
          fill
          priority
          loading="eager"
          fetchPriority="high"
          quality={82}
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/28 to-black/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/60" />

        <div className="relative z-10 mx-auto flex min-h-[96svh] w-full max-w-7xl items-center px-4 pb-28 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-4xl text-white">
            <Reveal direction="up" duration={0.7}>
              <p className="aab-label inline-flex items-center gap-3 text-amber-200">
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                Mount Bethel, Pennsylvania
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.08} duration={0.8}>
              <h1 className="mt-6 max-w-4xl font-serif text-6xl font-semibold leading-[0.92] tracking-[-0.045em] text-white sm:text-7xl lg:text-[6.7rem]">
                All Aspects
                <span className="mt-1 block font-display text-[0.72em] font-normal leading-none tracking-normal text-amber-200">
                  at the Barn
                </span>
              </h1>
            </Reveal>

            <Reveal direction="up" delay={0.18} duration={0.8}>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
                Antiques, events, a petting farm, and Barn Brew — all in one place.
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.28} duration={0.8}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#what-we-offer" className="aab-btn aab-btn-accent">
                  Explore the Barn
                </a>
                <Link
                  href="/contact"
                  className="aab-btn border border-white/45 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-stone-950"
                >
                  Plan a Visit
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="absolute bottom-20 right-5 z-10 hidden h-36 w-36 items-center justify-center rounded-full border border-white/35 bg-black/15 text-center text-[0.68rem] font-semibold uppercase leading-5 tracking-[0.18em] text-white/90 backdrop-blur-md sm:flex lg:right-12">
          Route 611
          <br />
          Mount Bethel
          <br />
          PA
        </div>

        <a
          href="#what-we-offer"
          className="absolute bottom-9 left-4 z-20 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/75 sm:flex sm:left-6 lg:left-8"
        >
          <span className="h-px w-10 bg-white/55" />
          Scroll to wander
        </a>

        <svg
          aria-hidden="true"
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          className="absolute -bottom-px left-0 z-10 h-20 w-full text-[var(--aab-applecore-pale)] sm:h-24"
        >
          <path
            fill="currentColor"
            d="M0,70 C210,15 410,105 650,58 C905,8 1110,85 1440,32 L1440,110 L0,110 Z"
          />
        </svg>
      </section>

      <OfferShowcase />

      <section className="relative bg-[var(--aab-page)] py-24 sm:py-28 lg:py-36">
        <div
          aria-hidden="true"
          className="absolute left-[12%] top-[14%] h-64 w-64 rounded-full bg-[var(--aab-citrus)]/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-8">
          <div className="relative min-h-[36rem] lg:col-span-7 lg:min-h-[44rem]">
            <ScrollSlide direction="right" className="absolute left-0 top-0 w-[78%]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[45%] rounded-b-[2.5rem] shadow-[0_32px_70px_-40px_rgba(43,33,24,0.55)]">
                <Image
                  src="/images/offer/antique-store.webp"
                  alt="Vintage furniture and collected finds inside All Aspects at the Barn"
                  fill
                  quality={80}
                  sizes="(max-width: 1023px) 78vw, 42vw"
                  className="object-cover"
                />
              </div>
            </ScrollSlide>

            <ScrollSlide
              direction="left"
              delay={0.15}
              className="absolute bottom-0 right-0 w-[48%]"
            >
              <div className="relative aspect-square overflow-hidden rounded-full border-[10px] border-[var(--aab-page)] shadow-[0_28px_60px_-36px_rgba(43,33,24,0.65)]">
                <Image
                  src="/images/offer/petting-farm.webp"
                  alt="Animals at the petting farm"
                  fill
                  quality={78}
                  sizes="(max-width: 1023px) 48vw, 24vw"
                  className="object-cover"
                />
              </div>
            </ScrollSlide>

            <div className="absolute right-[4%] top-[10%] hidden h-28 w-28 items-center justify-center rounded-full bg-[var(--aab-apricot)] text-center font-display text-2xl leading-7 text-[var(--aab-apricot-ink)] shadow-lg sm:flex">
              browse
              <br />
              &amp; meet
            </div>
          </div>

          <div className="lg:col-span-5 lg:pl-8">
            <ScrollSlide direction="up">
              <p className="aab-label text-[var(--aab-apricot-deep)]">More than one stop</p>
              <h2 className="mt-4 font-serif text-5xl text-gray-900 sm:text-6xl">
                Browse. Celebrate. Meet. Sip.
              </h2>
              <p className="mt-7 max-w-xl text-lg leading-8 text-gray-600">
                Vintage furniture, reclaimed pieces, event spaces, animal encounters, and specialty coffee share the same property.
              </p>

              <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 font-semibold text-gray-900"
                >
                  Our story
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/gallery"
                  className="group inline-flex items-center gap-3 font-semibold text-gray-900"
                >
                  See the space
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </ScrollSlide>
          </div>
        </div>
      </section>

      <section className="relative bg-[var(--aab-applecore-pale)] py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <ScrollSlide direction="right">
              <p className="font-display text-3xl text-[var(--aab-apricot-deep)]">a look around</p>
              <h2 className="mt-1 font-serif text-5xl text-gray-900 sm:text-6xl">
                The barn in pictures.
              </h2>
            </ScrollSlide>

            <ScrollSlide direction="left">
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-3 font-semibold text-gray-900"
              >
                Open full gallery
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 transition-all duration-300 group-hover:border-[var(--aab-apricot)] group-hover:bg-[var(--aab-apricot)] group-hover:text-[var(--aab-apricot-ink)]">
                  ↗
                </span>
              </Link>
            </ScrollSlide>
          </div>
        </div>

        <div className="flex snap-x snap-mandatory items-center gap-5 overflow-x-auto px-4 pb-5 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2))]">
          {HOME_GALLERY.map((image, i) => (
            <div
              key={image.src}
              className={`relative min-w-[74vw] snap-center overflow-hidden bg-stone-900 shadow-[0_24px_58px_-36px_rgba(43,33,24,0.5)] sm:min-w-[42vw] lg:min-w-[24rem] ${GALLERY_SHAPES[i % GALLERY_SHAPES.length]}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                quality={76}
                sizes="(max-width: 639px) 74vw, (max-width: 1023px) 42vw, 24rem"
                className="object-cover transition-transform duration-[900ms] hover:scale-[1.04]"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--aab-page)] py-24 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:px-8">
          <ScrollSlide direction="right">
            <div className="lg:sticky lg:top-32">
              <p className="aab-label text-[var(--aab-apricot-deep)]">Before you come</p>
              <h2 className="mt-4 font-serif text-5xl text-gray-900 sm:text-6xl">
                Good to know.
              </h2>
              <p className="mt-5 max-w-sm text-base leading-7 text-gray-600">
                A few quick answers before you browse, book, or bring the family.
              </p>
            </div>
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
                  Yes — barn weddings, birthday parties, and corporate gatherings. Contact us to talk dates.
                </p>
              </AccordionItem>

              <AccordionItem question="What can I find in your antique store?">
                <p>
                  Vintage furniture, reclaimed pieces, refinished primitives, home decor, and one-of-a-kind finds. New inventory arrives regularly.
                </p>
              </AccordionItem>

              <AccordionItem question="Is the petting farm open to the public?">
                <p>Yes — family-friendly animal encounters, all ages welcome.</p>
              </AccordionItem>

              <AccordionItem question="What is Barn Brew?">
                <p>
                  Our specialty coffee bar at the barn: espresso, cold brew, teas, and local baked goods.
                </p>
              </AccordionItem>

              <AccordionItem question="How do I book an event or visit?">
                <p>
                  Use our{" "}
                  <Link
                    href="/contact"
                    className="text-indigo-600 underline hover:text-indigo-800"
                  >
                    contact page
                  </Link>
                  , call (570) 583-2305, or email allaspectsrecycled@gmail.com.
                </p>
              </AccordionItem>

              <AccordionItem question="Do you offer delivery or shipping for antique items?">
                <p>
                  Delivery is available for many pieces, depending on your location and the item&apos;s size. Contact us for details and pricing.
                </p>
              </AccordionItem>

              <AccordionItem question="What are your hours of operation?">
                <p>Tuesday–Saturday 8am–5pm, Sunday 9am–5pm, closed Monday.</p>
              </AccordionItem>
            </Accordion>
          </ScrollSlide>
        </div>
      </section>

      <section className="relative overflow-hidden bg-neutral-950 py-24 text-white sm:py-28">
        <div
          aria-hidden="true"
          className="absolute -left-24 bottom-[-12rem] h-[34rem] w-[34rem] rounded-full bg-indigo-700/35 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-20 top-[-14rem] h-[32rem] w-[32rem] rounded-full bg-amber-400/15 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <ScrollSlide direction="up">
              <p className="aab-label text-amber-200">Come see it in person</p>
              <h2 className="mt-4 font-serif text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
                Ready to plan your visit or your event?
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
                Reach out for event details, availability, or questions about visiting All Aspects at the Barn.
              </p>
            </ScrollSlide>

            <ScrollSlide direction="up" delay={0.12}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="aab-btn aab-btn-accent">
                  Get in Touch
                </Link>
                <a
                  href="mailto:allaspectsrecycled@gmail.com?subject=All%20Aspects%20at%20the%20Barn%20inquiry"
                  className="aab-btn border border-white/30 bg-white/5 text-white hover:bg-white hover:text-stone-950"
                >
                  Email Us
                </a>
              </div>
            </ScrollSlide>
          </div>
        </div>
      </section>
    </div>
  );
}
