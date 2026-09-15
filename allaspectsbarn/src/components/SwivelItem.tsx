"use client";

import { useRef, ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

interface SwivelItemProps {
  children: ReactNode;
  className?: string;
  /** +1 = swivels right-first, -1 = left-first. Pass alternating values so
   *  each item swings opposite its neighbor (counter-crank). */
  direction?: 1 | -1;
  /** Peak swivel in degrees. */
  range?: number;
}

// Same weighted spring as the other swivel components — consistent feel.
const springSoft = { stiffness: 50, damping: 20, mass: 1.0, restDelta: 0.001 };

function easeInOut(t: number): number {
  const v = Math.max(0, Math.min(1, t));
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
}

export default function SwivelItem({
  children,
  className = "",
  direction = 1,
  range = 6,
}: SwivelItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const eased = useTransform(scrollYProgress, easeInOut);

  // Each item has its own scroll-driven swivel — direction flips per item
  // so neighbors counter-rotate like meshing gears.
  const rawAngle: MotionValue<number> = useTransform(
    eased,
    [0, 1],
    [range * direction, -range * direction]
  );
  const angle = useSpring(rawAngle, springSoft);

  const rawY: MotionValue<number> = useTransform(eased, [0, 1], [14, -14]);
  const y = useSpring(rawY, springSoft);

  if (reduce) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotate: angle,
        y,
        perspective: 800,
        transformOrigin: "center center" as const,
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}
