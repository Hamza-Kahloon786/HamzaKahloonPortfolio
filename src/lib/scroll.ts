"use client";

import type Lenis from "lenis";

let lenis: Lenis | null = null;
let locks = 0;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Smooth-scroll to a selector, element or y-offset. Falls back to native scrolling. */
export function scrollToTarget(target: string | HTMLElement | number, opts: { offset?: number; immediate?: boolean } = {}) {
  const offset = opts.offset ?? 0;
  // Render every section so positions are exact (phones defer off-screen sections).
  document.documentElement.classList.add("cv-off");
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate: opts.immediate, duration: 1.4 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior: opts.immediate ? "auto" : "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: opts.immediate ? "auto" : "smooth" });
}

/** Reference-counted page scroll lock for modals and overlays. */
export function lockScroll() {
  locks += 1;
  if (locks === 1) {
    lenis?.stop();
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--scrollbar-gap", `${gap}px`);
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${gap}px`;
  }
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    lenis?.start();
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }
}
