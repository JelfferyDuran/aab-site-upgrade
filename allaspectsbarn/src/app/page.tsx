import Link from "next/link";
import Image from "next/image";
import { getPageByRoute } from "@/lib/data";
import { Reveal, Stagger, StaggerItem, Parallax } from "@/components/motion";

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

        {/* Hero Image Slideshow */}
        {heroImages.length > 0 && (
          <div className="absolute inset-0">
            {heroImages.slice(0, 3).map((img, i) => (
              <Parallax key={i} speed={0.1 + i * 0.1} className="absolute inset-0">
                <Image
                  src={img.startsWith("http") ? img : `https://images.editor.website${img}`}
                  alt={`Venue ${i + 1}`}
                  fill
                  className="object-cover opacity-20"
                  sizes="100vw"
                />
              </Parallax>
            ))}
          </div>
        )}

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
               style={{ fontFamily: "var(--font-inter)" }}>
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
          <Reveal direction="up" className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              What We Offer
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From vintage treasures to unforgettable events, discover everything All Aspects Barn has to offer.
            </p>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <StaggerItem key={i}>
                <Link
                  href={feature.route}
                  className="block group p-8 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                >
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Image Gallery Preview */}
      {heroImages.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal direction="up" className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                Our Space
              </h2>
              <p className="text-lg text-gray-600">
                Take a peek inside our beautiful barn venue
              </p>
            </Reveal>

            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heroImages.slice(0, 6).map((img, i) => (
                <StaggerItem key={i}>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group">
                    <Image
                      src={img.startsWith("http") ? img : `https://images.editor.website${img}`}
                      alt={`Venue image ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal direction="up" className="text-center mt-12">
              <Link
                href="/gallery"
                className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-all duration-300"
              >
                View Full Gallery
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal direction="up">
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
              Ready to Plan Your Event?
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.15}>
            <p className="text-xl text-indigo-200 mb-8">
              Let us help you create an unforgettable experience at All Aspects Barn.
            </p>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-amber-500 hover:bg-amber-400 text-indigo-950 font-semibold rounded-full transition-all duration-300"
              >
                Get in Touch
              </Link>
              <a
                href="https://wa.me/12019897108?text=Hi! I'm interested in booking an event at All Aspects Barn."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-indigo-900 font-semibold rounded-full transition-all duration-300"
              >
                WhatsApp Us
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
