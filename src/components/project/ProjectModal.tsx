"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { animate } from "motion/react";
import { LuCheck, LuLink, LuX } from "react-icons/lu";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { play } from "@/lib/sound";
import { EASE } from "@/lib/utils";

/**
 * Modal shell for intercepted /projects/[slug] routes.
 * Animations are imperative so they replay correctly when Next.js restores
 * this route from a hidden <Activity> (effects re-run, state does not reset).
 */
export function ProjectModal({ children, title }: { children: React.ReactNode; title: string }) {
  const router = useRouter();
  const panel = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const [copied, setCopied] = useState(false);

  const close = useCallback(async () => {
    if (closing.current) return;
    closing.current = true;
    const p = panel.current;
    const b = backdrop.current;
    if (p && b) {
      await Promise.all([
        animate(p, { y: 70, opacity: 0, scale: 0.98 }, { duration: 0.38, ease: [0.7, 0, 0.84, 0] }),
        animate(b, { opacity: 0 }, { duration: 0.38 }),
      ]);
    }
    play("close");
    router.back();
  }, [router]);

  useEffect(() => {
    closing.current = false;
    const p = panel.current;
    const b = backdrop.current;
    lockScroll();
    play("open");
    if (p && b) {
      animate(b, { opacity: [0, 1] }, { duration: 0.45 });
      animate(p, { y: [90, 0], opacity: [0, 1], scale: [0.98, 1] }, { duration: 0.8, ease: EASE });
      p.focus({ preventScroll: true });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-[80]">
      <div ref={backdrop} onClick={close} className="absolute inset-0 bg-paper/80 opacity-0 backdrop-blur-md" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="absolute inset-x-0 bottom-0 top-[3vh] mx-auto flex max-w-6xl flex-col overflow-hidden rounded-t-[28px] border border-line-strong bg-paper-2 opacity-0 shadow-[0_40px_120px_-20px_rgba(16,16,24,0.22)] outline-none md:inset-x-6 md:bottom-[4vh] md:top-[4vh] md:rounded-[28px]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5 md:px-8">
          <span className="truncate font-mono text-[10px] uppercase tracking-[0.3em] text-mist">Case study</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={share}
              className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mist transition-colors hover:border-lilac hover:text-ink"
            >
              {copied ? <LuCheck className="text-emerald-600" /> : <LuLink />}
              {copied ? "Copied" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={close}
              className="inline-flex items-center gap-2 rounded-full border border-lilac/50 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-violet/25"
            >
              Close <LuX />
            </button>
          </div>
        </div>
        <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-5 pb-16 pt-10 md:px-12 md:pt-14">
          {children}
        </div>
      </div>
    </div>
  );
}
