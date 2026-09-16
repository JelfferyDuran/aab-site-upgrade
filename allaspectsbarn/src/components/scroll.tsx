"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion, useInView } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollSlideProps {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
  start?: string;
  className?: string;
}

export default function ScrollSlide({
  children,
  direction = "left",
  delay = 0,
  duration = 1,
  start = "top 85%",
  className,
}: ScrollSlideProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Fires ~300px before element enters viewport — ScrollTrigger is created
  // only then, not on initial page load. This defers the expensive ScrollTrigger
  // setup so it never competes with the LCP paint window.
  const inView = useInView(ref, { once: true, margin: "300px 0px" });

  useEffect(() => {
    if (reduce || !inView) return;
    const el = ref.current;
    if (!el) return;

    const x = direction === "left" ? -80 : direction === "right" ? 80 : 0;
    const y = direction === "up" ? -60 : direction === "down" ? 60 : 0;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, x, y },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [direction, delay, duration, start, reduce, inView]);

  // Compute the initial transform for the static (pre-animation) render
  const x = direction === "left" ? -80 : direction === "right" ? 80 : 0;
  const y = direction === "up" ? -60 : direction === "down" ? 60 : 0;

  if (reduce) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  // Before inView: render in the hidden state so there is no flash when
  // the ScrollTrigger activates. Opacity 0 + translate matches the GSAP "from" state.
  if (!inView) {
    return (
      <div
        ref={ref}
        className={className}
        style={{ opacity: 0, transform: `translate(${x}px, ${y}px)` }}
      >
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function ScrollFade({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "300px 0px" });

  useEffect(() => {
    if (reduce || !inView) return;
    const el = ref.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [delay, reduce, inView]);

  if (reduce) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  if (!inView) {
    return (
      <div ref={ref} className={className} style={{ opacity: 0, transform: "translateY(40px)" }}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function ScrollScale({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "300px 0px" });

  useEffect(() => {
    if (reduce || !inView) return;
    const el = ref.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, scale: 0.85 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [delay, reduce, inView]);

  if (reduce) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  if (!inView) {
    return (
      <div ref={ref} className={className} style={{ opacity: 0, transform: "scale(0.85)" }}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}