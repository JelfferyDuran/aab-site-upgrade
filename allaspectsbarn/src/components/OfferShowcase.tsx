"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

type Offer = {
  no: string;
  title: string;
  copy: string;
  href: string;
  img: string;
  alt: string;
};

/** Real photographs, cropped to a 4:3 card by scripts (not icons, not generated art). */
const OFFERS: Offer[] = [
  {
    no: "01",
    title: "Antique Store",
    copy: "Reclaimed finds, refinished furniture, and curios with a story.",
    href: "/about",
    img: "/images/offer/antique-store.webp",
    alt: "Vintage furniture, lamps and collectibles filling the antique shop at All Aspects at the Barn",
  },
  {
    no: "02",
    title: "Event Venue",
    copy: "Barn weddings, showers and celebrations under the open pavilion.",
    href: "/pavilion-party-rental",
    img: "/images/offer/event-venue.webp",
    alt: "The open-sided wooden pavilion and lawn set up for an event at All Aspects at the Barn",
  },
  {
    no: "03",
    title: "Petting Farm",
    copy: "Goats, sheep and animal encounters for all ages.",
    href: "/petting-farm",
    img: "/images/offer/petting-farm.webp",
    alt: "Goats and a pony waiting at the fence of the petting farm",
  },
  {
    no: "04",
    title: "Barn Brew",
    copy: "Espresso, local baked goods, and a market of nearby finds.",
    href: "/barn-brew-coffee-bar",
    img: "/images/offer/barn-brew.webp",
    alt: "The Barn Brew coffee and espresso bar sign among tall grasses and a carved bird sculpture",
  },
];

/** Resting tilt, alternating sign: neighbours lean opposite ways so the row reads hand-placed. */
const TILT = ["rotate-[-1.1deg]", "rotate-[0.85deg]", "rotate-[-0.75deg]", "rotate-[1.05deg]"];
const PLATE = ["rotate-[0.7deg]", "rotate-[-0.6deg]", "rotate-[0.8deg]", "rotate-[-0.75deg]"];
/** Organic vertical rhythm on wide screens — no mechanical baseline. */
const OFFSET = ["lg:mt-0", "lg:mt-10", "lg:mt-3", "lg:mt-12"];

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

function OfferCard({ offer, i, parallax }: { offer: Offer; i: number; parallax: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const photoY = useSpring(drift, { stiffness: 55, damping: 20, mass: 0.6 });

  return (
    <div ref={ref} className={`h-full ${OFFSET[i % OFFSET.length]}`}>
      <Link
        href={offer.href}
        className={`group relative block h-full ${TILT[i % TILT.length]} transition-transform duration-500 ease-out hover:rotate-0 focus-visible:rotate-0 focus-visible:outline-none`}
      >
        {/* Layer 1 — the plate: a warm card sitting just behind, tilted the other way. */}
        <span
          aria-hidden="true"
          className={`absolute inset-0 rounded-[1.6rem] bg-amber-100/80 ring-1 ring-stone-900/[0.06] shadow-[0_14px_30px_-22px_rgba(28,25,23,0.5)] translate-x-[6px] translate-y-[6px] ${PLATE[i % PLATE.length]}`}
        />

        <motion.div
          initial={{ y: 26, scale: 0.985 }}
          whileInView={{ y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: "spring", stiffness: 105, damping: 19, mass: 0.9, delay: i * 0.07 }}
          className="relative h-full overflow-hidden rounded-[1.6rem] bg-stone-900 ring-1 ring-stone-900/10 shadow-[0_22px_45px_-26px_rgba(28,25,23,0.6)]"
        >
          {/* Layer 2 — the photograph, drifting inside its frame for depth. */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {parallax ? (
              <motion.div style={{ y: photoY }} className="absolute inset-x-0 -inset-y-[6%]">
                <Image
                  src={offer.img}
                  alt={offer.alt}
                  fill
                  quality={74}
                  sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 23vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                />
              </motion.div>
            ) : (
              <div className="absolute inset-0">
                <Image
                  src={offer.img}
                  alt={offer.alt}
                  fill
                  quality={74}
                  sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 23vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                />
              </div>
            )}

            {/* Layer 3 — light: legibility scrim, brand wash, warm rim, film grain. */}
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-stone-950/88 via-stone-950/30 to-stone-950/5" />
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-80 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-60"
              style={{ background: "radial-gradient(125% 95% at 12% 112%, rgba(67,82,152,0.55) 0%, rgba(67,82,152,0) 62%)" }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-70 mix-blend-screen"
              style={{ background: "radial-gradient(80% 62% at 88% -8%, rgba(245,158,11,0.4) 0%, rgba(245,158,11,0) 70%)" }}
            />
            <div aria-hidden="true" className="absolute inset-0 opacity-[0.10] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
            <div aria-hidden="true" className="absolute inset-0 rounded-[1.6rem] ring-1 ring-inset ring-white/15" />
          </div>

          {/* Layer 4 — the type block, seated on its own pane of glass so the words always hold. */}
          <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
            <div className="rounded-[1.15rem] bg-stone-950/25 p-3.5 ring-1 ring-inset ring-white/[0.13] backdrop-blur-[2px] sm:p-4">
              <div className="flex items-center gap-3">
                <span className="font-display text-lg leading-none text-amber-200/95">{offer.no}</span>
                <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-amber-200/60 to-transparent" />
              </div>
              <h3 className="mt-2 font-serif text-2xl text-white drop-shadow-[0_2px_12px_rgba(12,10,9,0.65)]">{offer.title}</h3>
              <p className="mt-1 max-w-[30ch] text-sm leading-snug text-white/85">{offer.copy}</p>
              <span className="mt-3.5 inline-flex items-center gap-2 rounded-full bg-white/[0.14] px-3.5 py-1.5 text-[0.66rem] font-medium uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm transition-colors duration-300 group-hover:bg-amber-200 group-hover:text-stone-900 group-hover:ring-amber-200/70">
                Visit
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5">
                  <path d="M4 10.75h9.19l-3.22 3.22 1.06 1.06L16.56 10l-4.53-4.53-1.06 1.06 3.22 3.22H4v1z" />
                </svg>
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}

export default function OfferShowcase() {
  const reduce = useReducedMotion();
  const [parallax, setParallax] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setParallax(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduce]);

  return (
    <section id="what-we-offer" className="relative overflow-hidden bg-[#faf7f2] py-20 sm:py-24">
      {/* Section layers — warm light, a breath of brand indigo, faint paper grain. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -12%, #ffffff 0%, rgba(255,255,255,0) 58%), radial-gradient(72% 52% at 8% 104%, rgba(67,82,152,0.10) 0%, rgba(67,82,152,0) 72%), radial-gradient(62% 44% at 94% 6%, rgba(245,158,11,0.13) 0%, rgba(245,158,11,0) 72%)",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: GRAIN }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center sm:mb-16">
          <p className="font-display text-2xl text-amber-700/90">wander in</p>
          <h2 className="mt-1 font-serif text-4xl text-gray-900 sm:text-5xl">What We Offer</h2>
          <div aria-hidden="true" className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-stone-400/70 to-transparent" />
          <p className="mx-auto mt-4 max-w-xl text-gray-600">Four corners under one roof, on the Delaware Road in Mount Bethel.</p>
        </div>

        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:pb-12">
          {OFFERS.map((offer, i) => (
            <OfferCard key={offer.title} offer={offer} i={i} parallax={parallax} />
          ))}
        </div>
      </div>
    </section>
  );
}
