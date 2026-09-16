import ContactForm from "@/components/ContactForm";
import ScrollSlide, { ScrollFade } from "@/components/scroll";

export const metadata = {
  title: "Contact | All Aspects Barn",
  description: "Get in touch for events, classes, and product inquiries.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Contact Us
          </h1>
          <ScrollFade delay={0.2}>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
              And receive info about sales and classes we are offering!
            </p>
          </ScrollFade>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollSlide direction="left" delay={0}>
              <div className="bg-white rounded-2xl p-8 shadow-md text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Location</h3>
                <p className="text-gray-600">
                  1584 S Delaware Road<br />
                  Mount Bethel, PA 18343
                </p>
              </div>
            </ScrollSlide>

            <ScrollSlide direction="up" delay={0.1}>
              <div className="bg-white rounded-2xl p-8 shadow-md text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Phone</h3>
                <p className="text-gray-600">
                  <a href="tel:+15705832305" className="text-indigo-600 hover:underline">
                    (570) 583-2305
                  </a>
                </p>
              </div>
            </ScrollSlide>

            <ScrollSlide direction="right" delay={0.2}>
              <div className="bg-white rounded-2xl p-8 shadow-md text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Hours</h3>
                <p className="text-gray-600">
                  Tue–Sat: 8am – 5pm<br />
                  Sun: 9am – 5pm<br />
                  Mon: Closed
                </p>
              </div>
            </ScrollSlide>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />
    </div>
  );
}
