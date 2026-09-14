import Link from "next/link";

const footerLinks = {
  venue: [
    { href: "/about", label: "About Us" },
    { href: "/gallery", label: "Gallery" },
    { href: "/pavilion", label: "Pavilion" },
    { href: "/petting-farm", label: "Petting Farm" },
  ],
  services: [
    { href: "/barn-brew", label: "Barn Brew" },
    { href: "/events", label: "Events" },
    { href: "/weddings", label: "Weddings" },
    { href: "/contact", label: "Contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[var(--color-gray-900)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-3xl mb-4">AAB</h3>
            <p className="text-[var(--color-gray-400)] text-sm leading-relaxed">
              All Aspects Barn — where rustic charm meets modern elegance.
              Premium event venue for unforgettable moments.
            </p>
          </div>

          {/* Venue Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[var(--color-primary-300)]">
              Venue
            </h4>
            <ul className="space-y-3">
              {footerLinks.venue.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-gray-400)] text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[var(--color-primary-300)]">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-gray-400)] text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[var(--color-primary-300)]">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-[var(--color-gray-400)]">
              <li>📍 123 Barn Lane, Countryside</li>
              <li>📞 (555) 123-4567</li>
              <li>✉️ hello@allaspectsbarn.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--color-gray-800)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-gray-500)]">
            © {new Date().getFullYear()} All Aspects Barn. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-[var(--color-gray-500)] hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[var(--color-gray-500)] hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
