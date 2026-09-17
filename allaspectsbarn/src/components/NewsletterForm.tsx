"use client";

import { useState } from "react";
import { FORMSPREE_ENDPOINT } from "@/lib/forms";

/**
 * Footer newsletter form. Uses CSS transitions only — no framer-motion — so the
 * motion library stays out of the root layout chunk (LCP-critical).
 * Layout: idle state shows the form; success state swaps in a static confirm
 * panel. Reduced-motion honored via the global prefers-reduced-motion CSS block.
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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

  const buttonDisabled = status === "sending" || !email;

  if (status === "sent") {
    return (
      <div className="aaf-success">
        <div className="text-3xl mb-2">✅</div>
        <h3 className="text-lg font-bold text-green-800 mb-1">You&apos;re on the list!</h3>
        <p className="text-green-700 text-sm">Watch your inbox for updates.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
        <button
          type="submit"
          disabled={buttonDisabled}
          className={`aaf-btn px-5 py-2.5 text-white font-semibold rounded-xl transition-all text-sm whitespace-nowrap ${
            buttonDisabled
              ? "bg-[var(--color-gray-700)] cursor-not-allowed"
              : "bg-[var(--color-primary-400)] hover:bg-[var(--color-primary-300)]"
          }`}
        >
          {status === "sending" ? "..." : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-400 text-xs text-center">
          Something went wrong — try again.
        </p>
      )}
    </form>
  );
}
