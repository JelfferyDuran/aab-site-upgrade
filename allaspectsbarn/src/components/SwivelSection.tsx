"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";

interface SwivelProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export default function SwivelSection({ children, className = "", intensity = 1 }: SwivelProps) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const dir = Math.sign(intensity);
  const mag = Math.abs(intensity);

  // Rotation: scroll drives subtle swivel (±8° × intensity)
  const rawAngle: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [8 * dir * mag, -8 * dir * mag]);
  const springAngle = useSpring(rawAngle, { stiffness: 100, damping: 20, mass: 0.5 });

  // Skew: wave pattern for "gear tooth" feel
  const rawSkew: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [-2 * dir, 1 * dir, 0, -1 * dir, 2 * dir]
  );
  const springSkew = useSpring(rawSkew, { stiffness: 80, damping: 15 });

  // Y parallax for depth
  const rawY: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const springY = useSpring(rawY, { stiffness: 60, damping: 20 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotate: springAngle,
        skewY: springSkew,
        y: springY,
        transformOrigin: "center center" as const,
        perspective: 1000,
      }}
    >
      {children}
    </motion.div>
  );
}
