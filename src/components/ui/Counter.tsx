"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";

/** Counts up from 0 when it scrolls into view (or when `start` becomes true). */
export function Counter({ value, suffix = "", start, duration = 2 }: { value: number; suffix?: string; start?: boolean; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const go = start ?? inView;

  useEffect(() => {
    if (!go || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = `${Math.round(v).toLocaleString("en-US")}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [go, value, suffix, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {`${value.toLocaleString("en-US")}${suffix}`}
    </span>
  );
}
