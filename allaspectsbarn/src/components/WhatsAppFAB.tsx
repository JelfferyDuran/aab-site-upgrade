"use client";

import { useState, useEffect } from "react";

const EMAIL_ADDRESS = "allaspectsrecycled@gmail.com";
const EMAIL_SUBJECT = encodeURIComponent("Event inquiry — All Aspects at the Barn");

/**
 * WhatsApp/FAB trigger — appears after scroll (below the fold on load).
 * Replaces framer-motion with CSS transitions so the motion library is NOT
 * pulled into the root layout chunk (LCP-critical). Reduced-motion honored
 * via the global prefers-reduced-motion CSS block in globals.css (which nukes
 * all transitions).
 */
export default function WhatsAppFAB() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const url = `mailto:${EMAIL_ADDRESS}?subject=${EMAIL_SUBJECT}`;

  return (
    visible && (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Email All Aspects Barn"
        className="aaf-fab fixed bottom-6 right-6 z-[var(--z-fab)] flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-primary)] text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </a>
    )
  );
}
