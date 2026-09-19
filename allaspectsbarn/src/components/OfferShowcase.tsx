import Image from "next/image";
import Link from "next/link";

type Offer = {
  no: string;
  title: string;
  copy: string;
  href: string;
  img: string;
  alt: string;
};

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

const OFFSET = ["lg:mt-0", "lg:mt-16", "lg:mt-6", "lg:mt-20"];
const HEIGHT = ["h-[31rem] lg:h-[35rem]", "h-[29rem] lg:h-[31rem]", "h-[32rem] lg:h-[36rem]", "h-[30rem] lg:h-[32rem]"];

export default function OfferShowcase() {
  return (
    <section
      id="what-we-offer"
      className="relative overflow-hidden bg-[var(--aab-applecore-pale)] py-24 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-12 h-[34rem] w-[34rem] rounded-full bg-[var(--aab-apricot)]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 bottom-0 h-[38rem] w-[38rem] rounded-full bg-[var(--color-primary-500)]/12 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-16">
          <div>
            <p className="aab-label text-[var(--aab-apricot-deep)]">Explore the property</p>
            <p className="mt-4 font-display text-4xl text-[var(--aab-apricot-deep)] sm:text-5xl">
              wander in
            </p>
          </div>

          <div className="max-w-3xl">
            <h2 className="font-serif text-4xl text-gray-900 sm:text-5xl lg:text-6xl">
              Four ways to experience the barn.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Browse antiques, plan a celebration, meet the animals, or stop in for Barn Brew.
            </p>
          </div>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-7 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:items-start lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-4">
          {OFFERS.map((offer, i) => (
            <Link
              key={offer.title}
              href={offer.href}
              className={`group min-w-[82vw] snap-center sm:min-w-[45vw] lg:min-w-0 ${OFFSET[i]}`}
            >
              <div
                className={`relative overflow-hidden rounded-t-[999px] rounded-b-[2.25rem] bg-stone-900 shadow-[0_28px_65px_-38px_rgba(43,33,24,0.55)] ${HEIGHT[i]}`}
              >
                <Image
                  src={offer.img}
                  alt={offer.alt}
                  fill
                  quality={78}
                  sizes="(max-width: 639px) 82vw, (max-width: 1023px) 45vw, 24vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/82"
                />

                <div className="absolute left-1/2 top-7 -translate-x-1/2">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/15 font-mono text-xs font-semibold tracking-[0.18em] text-white backdrop-blur-sm">
                    {offer.no}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <h3 className="font-serif text-3xl text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.45)]">
                    {offer.title}
                  </h3>
                  <p className="mt-2 max-w-[30ch] text-sm leading-6 text-white/82">
                    {offer.copy}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 px-1">
                <span className="aab-label text-gray-600">Discover</span>
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-gray-800 transition-all duration-300 group-hover:translate-x-1 group-hover:border-[var(--aab-apricot)] group-hover:bg-[var(--aab-apricot)] group-hover:text-[var(--aab-apricot-ink)]"
                >
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
