"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import Image from "next/image";

interface SwivelCardProps {
  src: string;
  alt: string;
  index?: number;
  total?: number;
  category?: string;
}

export default function SwivelCard({ src, alt, index = 0, total = 1, category }: SwivelCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Alternate swivel direction: even cards left, odd cards right
  const direction = index % 2 === 0 ? 1 : -1;

  // Y-rotation: swivel left/right from -25° to 25° (like a puzzle piece locking in)
  const rawRotateY: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [35 * direction, 0, -35 * direction]
  );
  const springRotateY = useSpring(rawRotateY, { stiffness: 120, damping: 18, mass: 0.4 });

  // Slight X tilt for 3D depth
  const rawRotateX: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [8, 0, -8]
  );
  const springRotateX = useSpring(rawRotateX, { stiffness: 100, damping: 16 });

  // Scale: cards grow slightly as they enter center
  const rawScale: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.92, 1, 0.92]
  );
  const springScale = useSpring(rawScale, { stiffness: 90, damping: 15 });

  // Y parallax for layered depth
  const rawY: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    [40 * (1 / total), -40 * (1 / total)]
  );
  const springY = useSpring(rawY, { stiffness: 60, damping: 20 });

  // Stagger offset: cards start at different X positions and converge (puzzle effect)
  const rawX: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [(index % 3 - 1) * 30, 0, (index % 3 - 1) * 30]
  );
  const springX = useSpring(rawX, { stiffness: 80, damping: 18 });

  return (
    <motion.div
      ref={ref}
      className="relative"
      style={{
        perspective: 800,
        rotateY: springRotateY,
        rotateX: springRotateX,
        scale: springScale,
        y: springY,
        x: springX,
        transformStyle: "preserve-3d",
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
