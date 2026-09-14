"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";

export default function DragCarousel({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const { scrollXProgress } = useScroll({ container: ref });

  return (
    <div className="relative overflow-hidden">
      <div
        ref={ref}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex">{children}</div>
      </div>
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-indigo-500 origin-left"
        style={{ width: "100%", scaleX: scrollXProgress }}
      />
    </div>
  );
}
