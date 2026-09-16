import Accordion, { AccordionItem } from "@/components/Accordion";
import Link from "next/link";
import Image from "next/image";
import { getPageByRoute } from "@/lib/data";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import ScrollSlide from "@/components/scroll";
import SwivelItem from "@/components/SwivelItem";

export default function HomePage() {
  const home = getPageByRoute("home");

  const heroImages = home?.images || [];

  const features = [
    {
      title: "Antique Store",
      description: "Unique finds, reclaimed items, refinished furniture, and primitives.",
      icon: "🏺",
      route: "/about",
    },
    {
      title: "Event Venue",
      description: "Elegant barn weddings, celebrations, and corporate gatherings.",
      icon: "🎉",
      route: "/pavilion",
    },
    {
      title: "Petting Farm",
      description: "Family-friendly animal encounters and outdoor fun.",
      icon: "🐐",
      route: "/petting-farm",
    },
    {
      title: "Barn Brew",
      description: "Specialty coffee, espresso, and local baked goods.",
      icon: "☕",
      route: "/barn-brew",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Hero Background Image — main storefront photo */}
        <div className="absolute inset-0">
          <Image
            src="/images/storefront-hero.webp"
            alt="All Aspects Barn storefront"
            fill
            priority
            loading="eager"
            fetchPriority="high"
            quality={65}
            className="object-cover opacity-50"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-indigo-800/70 to-indigo-950/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal direction="up" duration={0.8}>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}>
              All Aspects<br />
              <span className="text-amber-400">at the Barn</span>
            </h1>
          </Reveal>

          <Reveal direction="up" delay={0.2} duration={0.8}>
            <p className="text-xl sm:text-2xl text-indigo-100 max-w-3xl mx-auto mb-8"
               style={{ fontFamily: "var(--font-cardo)" }}>
              {home?.og_description || "Antique Store, Gift Store, Home Decor Store, Birthday Parties, Venue, Event Venue, Petting Farm, Pavilion Rental"}
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.4} duration={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center px-8 py-4 bg-amber-500 hover:bg-amber-400 text-indigo-950 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Explore Our Venue
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-indigo-900 font-semibold rounded-full transition-all duration-300"
              >
                Book an Event
              </Link>
            </div>
          </Reveal>
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

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollSlide direction="left" className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              What We Offer
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From vintage treasures to unforgettable events, discover everything All Aspects Barn has to offer.
            </p>
          </ScrollSlide>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <StaggerItem key={i}>
                <SwivelItem direction={i % 2 === 0 ? 1 : -1} tilt={8} roll={2.5} className="h-full">
                  <Link
                    href={feature.route}
                    className="block group p-8 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full"
                  >
                    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Link>
                </SwivelItem>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Image Gallery Preview */}
      {heroImages.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollSlide direction="right" className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                Our Space
              </h2>
              <p className="text-lg text-gray-600">
                Take a peek inside our beautiful barn venue
              </p>
            </ScrollSlide>

            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heroImages.slice(0, 6).map((img, i) => (
                <StaggerItem key={i}>
                  <SwivelItem direction={i % 2 === 0 ? 1 : -1} tilt={13} roll={4} className="h-full">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group h-full">
                      <Image
                        src={img.startsWith("http") ? img : `https://images.editor.website${img}`}
                        alt={`Venue image ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </SwivelItem>
                </StaggerItem>
              ))}
            </Stagger>

            <ScrollSlide direction="up" className="text-center mt-12">
              <Link
                href="/gallery"
                className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-all duration-300"
              >
                View Full Gallery
              </Link>
            </ScrollSlide>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollSlide direction="up" className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about All Aspects Barn
            </p>
          </ScrollSlide>

          <ScrollSlide direction="up" delay={0.1}>
            <Accordion>
              <AccordionItem question="What is All Aspects Barn?" defaultOpen={true}>
                <p>
                  All Aspects Barn is a multi-faceted destination in New Jersey featuring an antique store, gift shop, home decor store, event venue, petting farm, and our very own Barn Brew coffee shop. We offer unique finds, reclaimed items, refinished furniture, primitives, and unforgettable experiences for the whole family.
                </p>
              </AccordionItem>

              <AccordionItem question="Do you host weddings and private events?">
                <p>
                  Absolutely! Our elegant barn venue is perfect for weddings, birthday parties, corporate gatherings, and celebrations of all kinds. Contact us to discuss your event details, and our team will help you create an unforgettable experience tailored to your vision.
                </p>
              </AccordionItem>

              <AccordionItem question="What can I find in your antique store?">
                <p>
                  Our antique store features a curated selection of unique finds including vintage furniture, reclaimed items, refinished primitives, home decor, collectibles, and one-of-a-kind treasures. We&apos;re constantly updating our inventory, so there&apos;s always something new to discover.
                </p>
              </AccordionItem>

              <AccordionItem question="Is the petting farm open to the public?">
                <p>
                  Yes! Our petting farm is family-friendly and open to visitors of all ages. It&apos;s a wonderful outdoor experience where kids and adults can enjoy animal encounters in a beautiful farm setting. Check our hours of operation and plan your visit today.
                </p>
              </AccordionItem>

              <AccordionItem question="What is Barn Brew?">
                <p>
                  Barn Brew is our specialty coffee shop located right at the barn. We serve expertly crafted espresso drinks, specialty coffee, and local baked goods. It&apos;s the perfect spot to relax, catch up with friends, or take a break while exploring our venue.
                </p>
              </AccordionItem>

              <AccordionItem question="How do I book an event or visit?">
                <p>
                  You can reach us through our <Link href="/contact" className="text-indigo-600 hover:text-indigo-800 underline">contact page</Link>, call us directly, or email allaspectsrecycled@gmail.com. For event bookings, we recommend contacting us as early as possible to secure your preferred date.
                </p>
              </AccordionItem>

              <AccordionItem question="Do you offer delivery or shipping for antique items?">
                <p>
                  We&apos;re happy to discuss delivery options for larger items and can arrange shipping for many of our antique and vintage pieces. Delivery availability depends on your location and the size of the item. Contact us for specific details and pricing.
                </p>
              </AccordionItem>

              <AccordionItem question="What are your hours of operation?">
                <p>
                  Our hours vary by season and day of the week. We recommend checking our website or calling ahead before your visit. Special events may also affect regular hours, so feel free to reach out if you have any questions about our current schedule.
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
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
              Ready to Plan Your Event?
            </h2>
          </ScrollSlide>
          <ScrollSlide direction="right" delay={0.15}>
            <p className="text-xl text-indigo-200 mb-8">
              Let us help you create an unforgettable experience at All Aspects Barn.
            </p>
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
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-indigo-900 font-semibold rounded-full transition-all duration-300"
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
