"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion } from "motion/react";
import { markIntroDone } from "@/lib/intro";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { EASE } from "@/lib/utils";

const KEY = "hk-intro";
const WORDS = ["WELCOME", "TO", "MY", "WORLD"];

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Phones skip the intro (it is also hidden by CSS before paint) so content shows immediately.
    const phone = window.matchMedia("(max-width: 767px)").matches;
    if (seen || reduced || phone || !root.current) {
      markIntroDone();
      if (root.current) root.current.style.display = "none";
      return;
    }

    const el = root.current;
    let cancelled = false;
    let locked = true;
    const release = () => {
      if (!locked) return;
      locked = false;
      unlockScroll();
    };
    lockScroll();
    const counter = animate(0, 100, {
      duration: 1.5,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        if (count.current) count.current.textContent = String(Math.round(v)).padStart(3, "0");
        if (bar.current) bar.current.style.transform = `scaleX(${v / 100})`;
      },
    });

    counter.then(async () => {
      if (cancelled) return;
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      await animate(el.querySelectorAll("[data-fade]"), { opacity: 0, y: -24 }, { duration: 0.35, ease: EASE });
      markIntroDone();
      release();
      await animate(el, { clipPath: "inset(0% 0% 100% 0%)" }, { duration: 0.9, ease: [0.76, 0, 0.24, 1] });
      if (!cancelled) setGone(true);
    });

    return () => {
      cancelled = true;
      counter.stop();
      release();
    };
  }, []);

  if (gone) return null;

  return (
    <div
      id="preloader"
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-paper px-[clamp(1rem,4vw,3.5rem)] py-8"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <noscript>
        <style>{`#preloader{display:none}`}</style>
      </noscript>
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/20 blur-[120px]" />

      <div data-fade className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-mist">
        <span>Hamza Kahloon</span>
        <span className="hidden sm:inline">Full Stack · AI / ML</span>
        <span>Lahore — PK</span>
      </div>

      <div data-fade className="relative flex items-center justify-center gap-4 sm:gap-6">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          className="font-display text-2xl tracking-[0.3em] text-mist sm:text-3xl"
        >
          ···
        </motion.span>
        <h2 className="flex flex-wrap justify-center gap-x-[0.6em] font-display text-[clamp(1.4rem,4.4vw,3.6rem)] tracking-[0.32em] text-ink">
          {WORDS.map((w, wi) => (
            <span key={w} className="inline-flex overflow-hidden">
              {w.split("").map((ch, ci) => (
                <motion.span
                  key={ci}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.25 + wi * 0.12 + ci * 0.035 }}
                  className={w === "MY" ? "text-gradient italic" : undefined}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </h2>
        <motion.span
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          className="font-display text-2xl tracking-[0.3em] text-mist sm:text-3xl"
        >
          ···
        </motion.span>
      </div>

      <div data-fade className="relative flex items-end justify-between gap-6">
        <span ref={count} className="text-outline font-display text-[clamp(4.5rem,14vw,12rem)] leading-[0.8] tabular-nums">
          000
        </span>
        <div className="mb-3 w-[min(42vw,340px)]">
          <div className="mb-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-mist">
            <span>Loading experience</span>
            <span>%</span>
          </div>
          <div className="h-px w-full bg-line">
            <div ref={bar} className="h-px w-full origin-left scale-x-0 bg-linear-to-r from-violet via-lilac to-cyan" />
          </div>
        </div>
      </div>
    </div>
  );
}
