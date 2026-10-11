"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuArrowLeft, LuArrowRight, LuMaximize2, LuX } from "react-icons/lu";
import type { ProjectShot } from "@/data/projects";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { cn, EASE, pad2 } from "@/lib/utils";

/** Screens for a case study, with a keyboard-friendly zoom lightbox. */
export function ProjectGallery({ shots, accent }: { shots: ProjectShot[]; accent: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul className="mt-6 grid gap-6 md:grid-cols-2">
        {shots.map((shot, i) => {
          const wide = shot.width / shot.height > 1.9;
          return (
            <li key={shot.src} className={cn(wide && "md:col-span-2")}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                data-cursor="view"
                data-cursor-label="Zoom"
                className="group block w-full text-left"
                aria-label={`Enlarge: ${shot.alt}`}
              >
                <Frame shot={shot} accent={accent}>
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    sizes={wide ? "(max-width: 1200px) 100vw, 1100px" : "(max-width: 768px) 100vw, 550px"}
                    className={cn(
                      "h-auto w-full transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.02]",
                      shot.kind === "device" && "mx-auto max-w-[92%] py-4",
                    )}
                  />
                  <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-paper/90 text-ink opacity-0 shadow-sm backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                    <LuMaximize2 className="size-4" />
                  </span>
                </Frame>
                {shot.caption && <p className="mt-3 text-sm leading-relaxed text-mist">{shot.caption}</p>}
              </button>
            </li>
          );
        })}
      </ul>
      <AnimatePresence>
        {open !== null && <Lightbox shots={shots} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </>
  );
}

function Frame({ shot, accent, children }: { shot: ProjectShot; accent: string; children: React.ReactNode }) {
  if (shot.kind === "device") {
    return (
      <div
        className="relative overflow-hidden rounded-2xl border border-line"
        style={{ background: `radial-gradient(70% 70% at 50% 40%, ${accent}24, transparent 75%), var(--color-paper-2)` }}
      >
        {children}
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-paper-2 shadow-[0_24px_50px_-30px_rgba(16,16,24,0.35)]">
      <div className="flex items-center gap-1.5 border-b border-line bg-paper-3/80 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="size-2.5 rounded-full bg-[#28c840]/80" />
      </div>
      <div className="relative overflow-hidden">{children}</div>
    </div>
  );
}

function Lightbox({
  shots,
  index,
  onIndex,
  onClose,
}: {
  shots: ProjectShot[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const shot = shots[index];
  const n = shots.length;
  const go = useCallback((d: number) => onIndex((index + d + n) % n), [index, n, onIndex]);

  useEffect(() => {
    lockScroll();
    return () => unlockScroll();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    // Capture phase so Escape closes the lightbox before the project modal sees it.
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [go, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[96] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-modal="true"
      aria-label={shot.alt}
    >
      <div className="absolute inset-0 bg-paper/95 backdrop-blur-xl" onClick={onClose} />
      <div className="relative flex items-center justify-between px-5 py-4 md:px-8">
        <span className="font-mono text-xs text-mist">
          {pad2(index + 1)} / {pad2(n)}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full border border-ink px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Close <LuX />
        </button>
      </div>
      <div className="pointer-events-none relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={shot.src}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="pointer-events-auto flex max-h-full flex-col items-center"
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              sizes="100vw"
              className={cn(
                "h-auto max-h-[78vh] w-auto max-w-full object-contain",
                shot.kind === "screen" && "rounded-xl border border-line-strong shadow-[0_30px_80px_-30px_rgba(16,16,24,0.45)]",
              )}
            />
            {shot.caption && <p className="mt-4 max-w-2xl text-center text-sm text-mist">{shot.caption}</p>}
          </motion.div>
        </AnimatePresence>
      </div>
      {n > 1 && (
        <div className="relative flex justify-center gap-3 pb-6 pt-4">
          {[
            { d: -1, label: "Previous screen", Icon: LuArrowLeft },
            { d: 1, label: "Next screen", Icon: LuArrowRight },
          ].map(({ d, label, Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => go(d)}
              aria-label={label}
              className="grid size-12 place-items-center rounded-full border border-line-strong bg-paper text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <Icon />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
