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
  /** +1 = tilts up from the left, -1 = tilts up from the right (use on alternating items) */
  direction?: 1 | -1;
  /** peak horizontal tilt (rotateY, deg) — the left/right lean */
  tilt?: number;
  /** peak roll (rotateZ, deg) — a touch of weight */
  roll?: number;
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Scroll-driven item that tilts in from the left or right and settles flat at
 * centre — neighbours given opposite `direction` lean away from each other.
 * Motion only; headings and buttons outside this wrapper stay stationary.
 */
export default function SwivelItem({
  children,
  className = "",
  direction = 1,
  tilt = 11,
  roll = 3.5,
}: SwivelItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const eased = useTransform(scrollYProgress, (t) =>
    easeInOutCubic(Math.max(0, Math.min(1, t)))
  );

  // enters leaning one way, flat as it crosses centre, leans out the other way
  const rawRotateY: MotionValue<number> = useTransform(
    eased,
    [0, 0.5, 1],
    [tilt * direction, 0, -tilt * direction]
  );
  const rawRotate: MotionValue<number> = useTransform(
    eased,
    [0, 0.5, 1],
    [roll * direction, 0, -roll * direction]
  );
  const rawY: MotionValue<number> = useTransform(eased, [0, 1], [20, -20]);

  const spring = {
    stiffness: 50,
    damping: 20,
    mass: 1.0,
    restDelta: 0.001,
  } as const;

  const rotateY = useSpring(rawRotateY, spring);
  const rotate = useSpring(rawRotate, spring);
  const y = useSpring(rawY, spring);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateY,
        rotate,
        y,
        transformPerspective: 1000,
        transformOrigin: "center center",
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}
