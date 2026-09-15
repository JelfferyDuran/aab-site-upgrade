"use client";

import { useRef, ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

interface SwivelProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

// Weighty, unified spring — consistent lag and organic settle across all axes.
const springSoft = { stiffness: 50, damping: 20, mass: 1.0, restDelta: 0.001 };

// easeInOutCubic — decelerates into the center instead of ticking linearly.
function easeInOut(t: number): number {
  const v = Math.max(0, Math.min(1, t));
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
}

export default function SwivelSection({ children, className = "", intensity = 1 }: SwivelProps) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const dir = Math.sign(intensity);
  const mag = Math.abs(intensity);

  // Eased progress — organic deceleration rather than linear tick.
  const eased = useTransform(scrollYProgress, easeInOut);

  // Gentle rotation ±6° — heavy crank that lags the scroll.
  const rawAngle: MotionValue<number> = useTransform(eased, [0, 1], [6 * dir * mag, -6 * dir * mag]);
  const springAngle = useSpring(rawAngle, springSoft);

  // Velocity "crank" kick: fast scroll swings it further, stopping settles it.
  // Direction-aware — scroll down swivels one way, up reverses.
  const velocity = useVelocity(scrollYProgress);
  const rawKick: MotionValue<number> = useTransform(velocity, (v) => {
    const k = Math.max(-4, Math.min(4, v * 0.02));
    return k * dir * mag;
  });
  const kick = useSpring(rawKick, { stiffness: 40, damping: 14, mass: 1.2 });

  // Total rotation = eased angle + velocity kick (single combined value, no phase fight).
  const totalRotate: MotionValue<number> = useTransform(
    [springAngle, kick] as [MotionValue<number>, MotionValue<number>],
    (values) => (values[0] as number) + (values[1] as number)
  );

  // Smooth sine skew wave — organic gear shimmer, no hard keyframe snaps.
  const rawSkew: MotionValue<number> = useTransform(eased, (t) => Math.sin(t * Math.PI * 2) * 1.6 * dir * mag);
  const springSkew = useSpring(rawSkew, { stiffness: 45, damping: 18, mass: 1.0 });

  const rawY: MotionValue<number> = useTransform(eased, [0, 1], [24 * mag, -24 * mag]);
  const springY = useSpring(rawY, { stiffness: 45, damping: 20, mass: 1.0 });

  if (reduce) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotate: totalRotate,
        skewY: springSkew,
        y: springY,
        transformOrigin: "center center" as const,
        perspective: 1000,
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}