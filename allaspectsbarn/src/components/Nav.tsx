"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/barn-brew-coffee-bar", label: "Barn Brew" },
  { href: "/pavilion-party-rental", label: "Pavilion" },
  { href: "/petting-farm", label: "Petting Farm" },
  { href: "/contact", label: "Contact" },
];

/**
 * Above-fold navigation. Replaces framer-motion with CSS animations so the
 * motion library is NOT pulled into the root layout chunk (LCP-critical).
 *
 * Behavior matches the previous motion version:
 *  - nav slides down from -100px, links stagger in 0.1s..0.35s
 *  - on reduced-motion: instant render, no animation (also caught globally by
 *    the prefers-reduced-motion CSS block in globals.css)
 *  - mobile menu opens with height reveal
 *
 * CSS classes: --aab-nav-link is set inline per link so the staggered delay
 * is authored in JS but executed entirely on the compositor via animation-delay.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const scrolledClass = scrolled
    ? "bg-white/95 backdrop-blur-md shadow-md"
    : "bg-transparent";
  const linkColor = scrolled
    ? "text-[var(--color-gray-700)]"
    : "text-white/90";
  const linkHover = scrolled ? "hover:text-[var(--color-primary)]" : "hover:text-white";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[var(--z-fixed)] transition-[background,box-shadow] duration-300 nav-enter ${scrolledClass}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className={`font-display text-2xl lg:text-3xl tracking-tight transition-colors ${
              scrolled ? "text-[var(--color-primary)]" : "text-white"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            AAB
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <span
                key={link.href}
                className="nav-stagger"
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <Link
                  href={link.href}
                  className={`text-sm font-medium tracking-wide uppercase transition-colors ${
                    linkColor
                  } ${linkHover} hover:opacity-80`}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-md transition-colors ${
              scrolled ? "text-[var(--color-gray-700)]" : "text-white"
            }`}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className="sr-only">Menu</span>
            <span className="block w-6 h-0.5 mb-1.5 transition-all duration-300 bg-current"></span>
            <span className="block w-6 h-0.5 mb-1.5 transition-all duration-300 bg-current"></span>
            <span className="block w-6 h-0.5 transition-all duration-300 bg-current"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu — height-reveal via CSS transition on max-height */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ease-out ${
          mobileOpen ? "max-h-[600px]" : "max-h-0"
        }}`}
      >
        <div className="bg-white border-t border-[var(--color-gray-200)] shadow-lg px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 text-[var(--color-gray-700)] font-medium rounded-md hover:bg-[var(--color-primary-50)] transition-colors nav-stagger`}
              style={{ animationDelay: `${0.05 + i * 0.05}s` }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
