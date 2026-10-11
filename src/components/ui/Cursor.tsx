"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { useFinePointer } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Variant = "default" | "link" | "view" | "drag" | "text" | "hidden";

/**
 * Custom cursor: precise dot + spring-trailing ring.
 * Any element can opt in with data-cursor="view|drag|link|text" and data-cursor-label="…".
 */
export function Cursor() {
  const enabled = useFinePointer();
  if (!enabled) return null;
  return <CursorInner />;
}

function CursorInner() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });
  const [variant, setVariant] = useState<Variant>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const el = t?.closest<HTMLElement>("[data-cursor]");
      if (el) {
        setVariant((el.dataset.cursor as Variant) || "link");
        setLabel(el.dataset.cursorLabel ?? "");
        return;
      }
      if (t?.closest("input, textarea, [contenteditable='true']")) {
        setVariant("text");
        setLabel("");
        return;
      }
      if (t?.closest("a, button, [role='button'], label, select, summary")) {
        setVariant("link");
        setLabel("");
        return;
      }
      setVariant("default");
      setLabel("");
    };
    const leave = () => setVisible(false);
    const pressed = () => setDown(true);
    const released = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", pressed);
    window.addEventListener("pointerup", released);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", pressed);
      window.removeEventListener("pointerup", released);
    };
  }, [x, y]);

  const big = variant === "view" || variant === "drag";
  const ringSize = big ? 92 : variant === "link" ? 46 : variant === "text" ? 6 : 34;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: rx, y: ry }}
      >
        <motion.div
          className={cn(
            "grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border transition-colors duration-300",
            big ? "border-transparent bg-violet/95" : variant === "link" ? "border-[1.5px] border-violet bg-transparent" : "border-ink/40 bg-transparent",
          )}
          animate={{
            width: ringSize,
            height: variant === "text" ? 28 : ringSize,
            opacity: visible ? 1 : 0,
            scale: down ? 0.85 : 1,
            borderRadius: variant === "text" ? 2 : 999,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        >
          <AnimatePresence>
            {big && (
              <motion.span
                key={label || variant}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-white"
              >
                {label || (variant === "drag" ? "Drag" : "View")}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-violet"
          animate={{ width: big || variant !== "default" ? 0 : 6, height: big || variant !== "default" ? 0 : 6, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </div>
  );
}
