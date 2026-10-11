"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { registerLenis } from "@/lib/scroll";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Touch devices already scroll natively and smoothly; skip the extra animation loop there.
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
    });
    registerLenis(lenis);
    return () => {
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
