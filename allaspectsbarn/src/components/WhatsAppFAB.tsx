"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const EMAIL_ADDRESS = "allaspectsrecycled@gmail.com";
const EMAIL_SUBJECT = encodeURIComponent("Event inquiry — All Aspects at the Barn");

export default function WhatsAppFAB() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const url = `mailto:${EMAIL_ADDRESS}?subject=${EMAIL_SUBJECT}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Email All Aspects Barn"
          initial={reduce ? undefined : { scale: 0, opacity: 0 }}
          animate={reduce ? undefined : { scale: 1, opacity: 1 }}
          exit={reduce ? undefined : { scale: 0, opacity: 0 }}
          whileHover={reduce ? undefined : { scale: 1.15 }}
          whileTap={reduce ? undefined : { scale: 0.95 }}
          transition={reduce ? undefined : { type: "spring", stiffness: 300, damping: 20 }}
          className="fixed bottom-6 right-6 z-[var(--z-fab)] flex items-center justify-center w-14 h-14 rounded-full bg-[#435298] text-white shadow-lg hover:shadow-xl"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
