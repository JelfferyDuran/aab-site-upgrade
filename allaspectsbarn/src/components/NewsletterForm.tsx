"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xpwdqkrl";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const reduce = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("sent");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {status === "sent" ? (
        reduce ? (
          <div
            key="success"
            className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 text-center"
          >
            <div className="text-3xl mb-2">✅</div>
            <h3 className="text-lg font-bold text-green-800 mb-1">You&apos;re on the list!</h3>
            <p className="text-green-700 text-sm">Watch your inbox for updates.</p>
          </div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 text-center"
          >
            <div className="text-3xl mb-2">✅</div>
            <h3 className="text-lg font-bold text-green-800 mb-1">You&apos;re on the list!</h3>
            <p className="text-green-700 text-sm">Watch your inbox for updates.</p>
          </motion.div>
        )
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          initial={reduce ? undefined : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          className="space-y-3"
        >
          <label className="block text-sm font-medium text-[var(--color-gray-400)]">
            Join our newsletter
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-2.5 border-2 border-[var(--color-gray-700)] rounded-xl text-white placeholder-[var(--color-gray-500)] bg-transparent focus:border-[var(--color-primary-400)] focus:outline-none transition-colors text-sm"
            />
            <motion.button
              type="submit"
              disabled={status === "sending" || !email}
              className="px-5 py-2.5 bg-[var(--color-primary-400)] hover:bg-[var(--color-primary-300)] disabled:bg-[var(--color-gray-700)] text-white font-semibold rounded-xl transition-all text-sm whitespace-nowrap"
              whileTap={reduce ? undefined : { scale: status === "sending" ? 1 : 0.97 }}
            >
              {status === "sending" ? "..." : "Subscribe"}
            </motion.button>
          </div>
          {status === "error" && (
            reduce ? (
              <div className="text-red-400 text-xs text-center">
                Something went wrong — try again.
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs text-center"
              >
                Something went wrong — try again.
              </motion.p>
            )
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
