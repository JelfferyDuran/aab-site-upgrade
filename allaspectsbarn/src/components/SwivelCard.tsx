"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  useReducedMotion,
  useInView,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";

interface SwivelCardProps {
  src: string;
  alt: string;
  index?: number;
  total?: number;
  category?: string;
}

// One unified, weighty spring for every axis — consistent lag, organic settle.
const springSoft = { stiffness: 55, damping: 20, mass: 0.9, restDelta: 0.001 };

// easeInOutCubic — motion decelerates into the center instead of ticking linearly.
function easeInOut(t: number): number {
  const v = Math.max(0, Math.min(1, t));
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
}

/**
 * Scroll-driven 3D gallery card with swivel, banking, scale, and parallax.
 *
 * Motion hooks are always registered (React hooks rule), but transforms are
 * only applied to the DOM when the card is within 300px of the viewport.
 * Before that, a static div is rendered — no spring loops, no style updates.
 * Defers below-fold motion so it never competes with the LCP paint window.
 */
export default function SwivelCard({ src, alt, index = 0, total = 1, category }: SwivelCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "300px 0px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const direction = index % 2 === 0 ? 1 : -1;

  // --- Gentle position swivel -------------------------------------------------
  const eased = useTransform(scrollYProgress, easeInOut);
  const rawRotateY: MotionValue<number> = useTransform(eased, [0, 1], [12 * direction, -12 * direction]);
  const rotateY = useSpring(rawRotateY, springSoft);

  // --- Velocity "crank" kick ---------------------------------------------------
  const velocity = useVelocity(scrollYProgress);
  const rawKick: MotionValue<number> = useTransform(velocity, (v) => {
    const k = Math.max(-10, Math.min(10, v * 0.02));
    return k * direction;
  });
  const kick = useSpring(rawKick, { stiffness: 42, damping: 15, mass: 1.1 });

  // Tiny banking tilt driven by the same kick (subtle 3D life, no extra spring phase).
  const rotateZ: MotionValue<number> = useTransform(kick, (k) => k * 0.35);

  // --- Subtle depth (much gentler than before) ----------------------------------
  const rawRotateX: MotionValue<number> = useTransform(scrollYProgress, [0, 0.5, 1], [4, 0, -4]);
  const rotateX = useSpring(rawRotateX, springSoft);

  const rawScale: MotionValue<number> = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const scale = useSpring(rawScale, springSoft);

  const rawY: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [28 * (1 / total), -28 * (1 / total)]);
  const y = useSpring(rawY, springSoft);

  const rawX: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [(index % 3 - 1) * 18, 0, (index % 3 - 1) * 18]
  );
  const x = useSpring(rawX, springSoft);

  if (reduce) {
    return (
      <div className="relative">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl group bg-gray-200">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>
    );
  }

  // Below the fold: render static placeholder — no motion styles applied.
  // The useScroll/useSpring hooks still run (hooks rule) but their values
  // are not written to the DOM, so no spring loops or style updates.
  if (!inView) {
    return (
      <div ref={ref} className="relative">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl group bg-gray-200">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="relative"
      style={{
        perspective: 900,
        rotateY,
        rotateX,
        rotateZ,
        scale,
        y,
        x,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl group bg-gray-200">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Subtle 3D edge highlight */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.06) 100%)",
          }}
        />
        {/* Category badge */}
        {category && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {category}
          </div>
        )}
      </div>
    </motion.div>
  );
}