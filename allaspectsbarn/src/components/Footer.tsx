import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

const footerLinks = {
  venue: [
    { href: "/about", label: "About Us" },
    { href: "/gallery", label: "Gallery" },
    { href: "/pavilion-party-rental", label: "Pavilion" },
    { href: "/petting-farm", label: "Petting Farm" },
  ],
  services: [
    { href: "/barn-brew-coffee-bar", label: "Barn Brew" },
    { href: "/shop", label: "Shop" },
    { href: "/contact", label: "Contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[var(--aab-footer-bg)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-3xl mb-4">AAB</h3>
            <p className="text-[var(--aab-footer-ink)] text-sm leading-relaxed mb-6">
              All Aspects Barn — where rustic charm meets modern elegance.
              Premium event venue for unforgettable moments.
            </p>
            <NewsletterForm />
          </div>

          {/* Venue Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[var(--aab-footer-head)]">
              Venue
            </h4>
            <ul className="space-y-3">
              {footerLinks.venue.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--aab-footer-ink)] text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[var(--aab-footer-head)]">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--aab-footer-ink)] text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[var(--aab-footer-head)]">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-[var(--aab-footer-ink)]">
              <li>📍 1584 S Delaware Road, Mount Bethel, PA 18343</li>
              <li>📞 <a href="tel:+15705832305" className="hover:text-white transition-colors">(570) 583-2305</a></li>
              <li>✉️ <a href="mailto:allaspectsrecycled@gmail.com" className="hover:text-white transition-colors">allaspectsrecycled@gmail.com</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--aab-footer-line)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--aab-footer-muted)]">
            © {new Date().getFullYear()} All Aspects Barn. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-[var(--aab-footer-muted)] hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[var(--aab-footer-muted)] hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
