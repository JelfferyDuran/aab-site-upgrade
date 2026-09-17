import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  SITE.address.display,
)}`;

const MOMENTS = [
  {
    title: "Browse the barn",
    copy: "Take your time with vintage furniture, reclaimed pieces, gifts, and one-of-a-kind finds.",
  },
  {
    title: "Meet the animals",
    copy: "Make the petting farm part of the visit and give younger guests something they will remember.",
  },
  {
    title: "Grab a Barn Brew",
    copy: "Coffee, espresso, tea, and local baked goods make an easy pause between stops around the property.",
  },
  {
    title: "Stay for the setting",
    copy: "The barn, pavilion, shop, and grounds all share one destination in Mount Bethel.",
  },
] as const;

export default function HomeVisitPlanner() {
  return (
    <section id="plan-your-visit" className="relative overflow-hidden bg-[#253266] py-20 text-white sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(80% 70% at 12% 0%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 62%), radial-gradient(55% 65% at 92% 100%, rgba(245,158,11,0.18) 0%, rgba(245,158,11,0) 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
        <div>
          <p className="font-display text-2xl text-amber-200">make a day of it</p>
          <h2
            className="mt-2 max-w-xl text-4xl font-bold leading-tight sm:text-5xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            One stop. A lot more than a store.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
            Come for a specific find or make the barn part of the day. Shopping, animals, coffee, and event spaces all live on the same property.
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {MOMENTS.map((moment, index) => (
              <div
                key={moment.title}
                className="rounded-2xl border border-white/12 bg-white/[0.07] p-5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:bg-white/[0.10]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-300 text-xs font-bold text-indigo-950">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-xl text-white">{moment.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/70">{moment.copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-amber-300 px-6 py-3.5 font-semibold text-indigo-950 transition-colors hover:bg-amber-200"
            >
              Get Directions
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/35 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-white hover:text-indigo-950"
            >
              Ask a Question
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[680px] lg:max-w-none">
          <div className="grid grid-cols-12 grid-rows-[110px_120px_120px_105px] gap-3 sm:grid-rows-[135px_145px_145px_125px]">
            <div className="relative col-span-7 row-span-3 overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/15">
              <Image
                src="/images/offer/antique-store.webp"
                alt="Vintage furniture and unique finds inside All Aspects at the Barn"
                fill
                sizes="(max-width: 1024px) 58vw, 34vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/35 to-transparent" />
            </div>

            <div className="relative col-span-5 row-span-2 overflow-hidden rounded-[1.6rem] shadow-xl ring-1 ring-white/15">
              <Image
                src="/images/offer/petting-farm.webp"
                alt="Animals at the All Aspects at the Barn petting farm"
                fill
                sizes="(max-width: 1024px) 40vw, 24vw"
                className="object-cover"
              />
            </div>

            <div className="relative col-span-5 row-span-2 overflow-hidden rounded-[1.6rem] shadow-xl ring-1 ring-white/15">
              <Image
                src="/images/offer/barn-brew.webp"
                alt="Barn Brew coffee area at All Aspects at the Barn"
                fill
                sizes="(max-width: 1024px) 40vw, 24vw"
                className="object-cover"
              />
            </div>

            <div className="col-span-7 flex items-center rounded-[1.6rem] border border-white/15 bg-white/[0.09] px-5 py-4 backdrop-blur-md sm:px-6">
              <div className="min-w-0">
                <p className="text-[0.67rem] font-semibold uppercase tracking-[0.22em] text-amber-200">Visit the barn</p>
                <p className="mt-1 truncate font-serif text-lg text-white sm:text-xl">{SITE.address.display}</p>
                <p className="mt-1 text-xs leading-5 text-white/65 sm:text-sm">{SITE.hours.display}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
