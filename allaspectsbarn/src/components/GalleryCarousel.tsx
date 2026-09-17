"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

export interface CarouselImage {
  src: string;
  alt: string;
  category?: string;
}

interface GalleryCarouselProps {
  images: CarouselImage[];
  /** "stage" = full viewer (thumb rail + autoplay). "strip" = compact peek rail. */
  variant?: "stage" | "strip";
  autoPlayMs?: number;
}

/** Only the active slide ±2 gets a real <Image>. 95 gallery JPGs never load at once. */
const MOUNT_WINDOW = 2;

/** House spring — heavy weighted settle, consistent with SwivelCard / ScrollSlide. */
const settle = { type: "spring", stiffness: 55, damping: 20, mass: 0.9 } as const;

const ARROW_LEFT = "M15.75 19.5 8.25 12l7.5-7.5";
const ARROW_RIGHT = "m8.25 4.5 7.5 7.5-7.5 7.5";
const PLAY = "M8 5.14v13.72L19 12z";
const PAUSE = "M9 5h2v14H9zM13 5h2v14h-2z";
const EXPAND = "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15m11.25 5.25h-4.5m4.5 0v-4.5m0 4.5L15 15";
const CLOSE = "M6 6l12 12M18 6 6 18";

function Icon({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/**
 * Contained gallery viewer. Every photo lives in one stage — the visitor never
 * scrolls picture-to-picture. Swipe/drag is velocity-weighted (a flick carries
 * the settle; a slow nudge springs back), each slide counter-rotates against its
 * neighbour, and keyboard/thumbnail/lightbox paths all land on the same index.
 */
export default function GalleryCarousel({ images, variant = "stage", autoPlayMs = 6000 }: GalleryCarouselProps) {
  const reduce = useReducedMotion();
  const isStrip = variant === "strip";

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [hovered, setHovered] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dragX = useMotionValue(0);

  const total = images.length;
  const safeActive = total ? Math.min(active, total - 1) : 0;

  const go = useCallback(
    (delta: number) => {
      setActive((prev) => {
        if (!total) return 0;
        return (prev + delta + total) % total;
      });
    },
    [total]
  );

  const goTo = useCallback((i: number) => setActive(i), []);

  // A filter change can shrink the set under the current index.
  useEffect(() => {
    if (total && active > total - 1) setActive(0);
  }, [total, active]);

  // Autoplay — deep-linked to the visible index, paused on hover/drag/lightbox.
  useEffect(() => {
    if (!playing || reduce || total < 2 || hovered || lightbox) return;
    const id = setInterval(() => setActive((p) => (p + 1) % total), autoPlayMs);
    return () => clearInterval(id);
  }, [playing, reduce, total, hovered, lightbox, autoPlayMs]);

  // Keep the active thumbnail in view without yanking the page around.
  useEffect(() => {
    if (isStrip) return;
    thumbRefs.current[safeActive]?.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
  }, [safeActive, isStrip, reduce]);

  // Lightbox keyboard contract.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, go]);

  const onDragEnd = useCallback(
    (_e: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      // Velocity-weighted: a flick carries, a slow nudge does not.
      const power = info.offset.x + info.velocity.x * 0.22;
      if (power < -60) go(1);
      else if (power > 60) go(-1);
      animate(dragX, 0, { type: "spring", stiffness: 55, damping: 20, mass: 0.9, velocity: info.velocity.x });
    },
    [go, dragX]
  );

  const slideMotion = useMemo(
    () =>
      (offset: number) => {
        if (reduce) {
          return { opacity: offset === 0 ? 1 : 0, zIndex: offset === 0 ? 2 : 1 };
        }
        return {
          x: `${offset * 100}%`,
          rotateY: offset * -7,
          rotateZ: offset * 1.1,
          scale: offset === 0 ? 1 : 0.86,
          opacity: Math.abs(offset) > 1 ? 0 : offset === 0 ? 1 : 0.4,
          zIndex: offset === 0 ? 2 : 1,
        };
      },
    [reduce]
  );

  if (!total) return null;

  const current = images[safeActive];

  return (
    <div className={isStrip ? "" : "w-full"}>
      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="All Aspects at the Barn photo gallery"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(-1);
          }
          if (e.key === "Home") goTo(0);
          if (e.key === "End") goTo(total - 1);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 rounded-2xl"
      >
        <motion.div
          drag={reduce || total < 2 ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          dragMomentum={false}
          onDragEnd={onDragEnd as unknown as (e: unknown, i: unknown) => void}
          style={{ x: dragX }}
          className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-950 select-none cursor-grab active:cursor-grabbing shadow-2xl"
        >
          {images.map((img, i) => {
            const offset = i - safeActive;
            const mounted = reduce ? offset === 0 : Math.abs(offset) <= MOUNT_WINDOW;
            return (
              <motion.div
                key={img.src}
                animate={slideMotion(offset)}
                transition={settle}
                style={{ perspective: 1200, transformStyle: "preserve-3d" }}
                className={`absolute inset-0 ${offset === 0 ? "" : "pointer-events-none"}`}
                aria-hidden={offset !== 0}
              >
                {mounted ? (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    draggable={false}
                    className="object-contain"
                    sizes={isStrip ? "(max-width: 768px) 100vw, 900px" : "(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 1080px"}
                    quality={80}
                    priority={variant === "stage" && i === 0}
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-950" />
                )}
              </motion.div>
            );
          })}

          {/* Neutral scrim — darkens the edges for chrome legibility, adds zero hue. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />

          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="absolute inset-0 z-[3] cursor-zoom-in"
            aria-label={`Open ${current.alt} full screen`}
          />

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 z-[4] -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/85 text-neutral-900 backdrop-blur transition hover:bg-white hover:scale-105"
              >
                <Icon d={ARROW_LEFT} className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 z-[4] -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/85 text-neutral-900 backdrop-blur transition hover:bg-white hover:scale-105"
              >
                <Icon d={ARROW_RIGHT} className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="absolute inset-x-0 bottom-0 z-[4] flex items-center justify-between gap-3 p-3 sm:p-4">
            <div className="flex items-center gap-2">
              {current.category && (
                <span className="rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur-sm">
                  {current.category}
                </span>
              )}
              <span className="rounded-full bg-black/55 px-3 py-1 text-xs font-medium tabular-nums text-white/95 backdrop-blur-sm">
                {safeActive + 1} / {total}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {!isStrip && !reduce && total > 1 && (
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                  className="grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
                >
                  <Icon d={playing ? PAUSE : PLAY} className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setLightbox(true)}
                aria-label="View full screen"
                className="grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
              >
                <Icon d={EXPAND} className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        <p aria-live="polite" className="sr-only">
          Photo {safeActive + 1} of {total}
        </p>
      </div>

      {!isStrip && total > 1 && (
        <div
          className="mt-4 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Gallery thumbnails"
        >
          {images.map((img, i) => (
            <button
              key={`thumb-${img.src}`}
              ref={(el) => {
                thumbRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              aria-selected={i === safeActive}
              aria-label={`Photo ${i + 1}: ${img.alt}`}
              onClick={() => goTo(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-all duration-300 ${
                i === safeActive ? "ring-2 ring-amber-500 opacity-100" : "opacity-55 hover:opacity-90"
              }`}
            >
              <Image src={img.src} alt="" fill className="object-cover" sizes="96px" quality={45} loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.22 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
          >
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Close viewer"
              className="absolute right-4 top-4 z-[102] grid h-11 w-11 place-items-center rounded-full bg-white/12 text-white transition hover:bg-white/25"
            >
              <Icon d={CLOSE} className="h-5 w-5" />
            </button>

            <motion.div
              drag={reduce || total < 2 ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              dragMomentum={false}
              onDragEnd={onDragEnd as unknown as (e: unknown, i: unknown) => void}
              style={{ x: dragX }}
              className="absolute inset-0 grid place-items-center px-4 py-16 sm:px-16"
            >
              <div className="relative h-full w-full">
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  quality={85}
                  priority
                />
              </div>
            </motion.div>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 z-[102] -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/12 text-white transition hover:bg-white/25"
                >
                  <Icon d={ARROW_LEFT} className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 z-[102] -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/12 text-white transition hover:bg-white/25"
                >
                  <Icon d={ARROW_RIGHT} className="h-6 w-6" />
                </button>
              </>
            )}

            <p className="absolute inset-x-0 bottom-6 z-[102] text-center text-sm tabular-nums text-white/85">
              {safeActive + 1} / {total}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
