"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/** 3D tilt that follows the pointer, with an optional moving glare highlight. */
export function Tilt({
  children,
  className,
  max = 9,
  glare = true,
  scale = 1.015,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const s = useMotionValue(1);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const cfg = { stiffness: 180, damping: 18, mass: 0.5 };
  const srx = useSpring(rx, cfg);
  const sry = useSpring(ry, cfg);
  const ss = useSpring(s, cfg);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.16), transparent 55%)`;

  return (
    <motion.div
      ref={ref}
      className={cn("group/tilt relative [transform-style:preserve-3d]", className)}
      style={{ rotateX: srx, rotateY: sry, scale: ss, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set(-(py - 0.5) * max * 2);
        s.set(scale);
        gx.set(px * 100);
        gy.set(py * 100);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        s.set(1);
      }}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover/tilt:opacity-100"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
}
