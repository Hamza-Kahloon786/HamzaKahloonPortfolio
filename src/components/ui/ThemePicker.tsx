"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuCheck } from "react-icons/lu";
import { THEMES, applyTheme, themeStore } from "@/lib/theme";
import { cn, EASE } from "@/lib/utils";

const swatch = (colors: readonly string[]) => `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 45%, ${colors[1]} 100%)`;

/** Navbar control that lets visitors pick the site's color theme (remembered per browser). */
export function ThemePicker() {
  const current = useSyncExternalStore(themeStore.subscribe, themeStore.get, themeStore.server);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const active = THEMES.find((t) => t.id === current) ?? THEMES[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Color theme: ${active.name}. Change theme`}
        title="Color theme"
        className="grid size-10 place-items-center rounded-full border-[1.5px] border-line-strong transition-colors hover:border-ink"
      >
        <span className="size-5 rounded-full ring-2 ring-paper shadow-[0_0_0_1px_rgba(0,0,0,0.12)]" style={{ background: swatch(active.colors) }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-x-4 top-[80px] z-50 origin-top rounded-2xl border border-line-strong bg-paper p-3 shadow-[0_24px_60px_-20px_rgba(10,10,10,0.35)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+12px)] sm:w-[272px] sm:origin-top-right"
          >
            <p className="px-1 pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-dim">Color theme</p>
            <div role="radiogroup" aria-label="Color theme" className="grid grid-cols-3 gap-2">
              {THEMES.map((t) => {
                const selected = t.id === current;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => applyTheme(t.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 transition-colors",
                      selected ? "border-ink bg-paper-2" : "border-transparent hover:border-line-strong hover:bg-paper-2",
                    )}
                  >
                    <span className="relative grid size-9 place-items-center rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]" style={{ background: swatch(t.colors) }}>
                      {selected && <LuCheck className="size-4 text-white drop-shadow" />}
                    </span>
                    <span className={cn("text-xs", selected ? "font-semibold text-ink" : "text-mist")}>{t.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
