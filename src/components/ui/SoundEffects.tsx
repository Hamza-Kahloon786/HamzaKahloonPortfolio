"use client";

import { useEffect, useSyncExternalStore } from "react";
import { LuVolume2, LuVolumeX } from "react-icons/lu";
import { play, setSoundEnabled, soundStore } from "@/lib/sound";
import { cn } from "@/lib/utils";

const INTERACTIVE = "a, button, [role='button'], [data-cursor]";

export function useSoundEnabled() {
  return useSyncExternalStore(soundStore.subscribe, soundStore.get, soundStore.server);
}

/** Global hover ticks and click sounds for interactive elements (only while sound is on). */
export function SoundEffects() {
  const enabled = useSoundEnabled();

  useEffect(() => {
    if (!enabled) return;
    let last: Element | null = null;
    let lastAt = 0;
    const over = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element | null)?.closest(INTERACTIVE) ?? null;
      if (el === last) return;
      last = el;
      const now = performance.now();
      if (el && now - lastAt > 70) {
        lastAt = now;
        play("tick");
      }
    };
    const down = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest(INTERACTIVE)) play("click");
    };
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    return () => {
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
    };
  }, [enabled]);

  return null;
}

export function SoundToggle({ className }: { className?: string }) {
  const enabled = useSoundEnabled();
  return (
    <button
      type="button"
      onClick={() => setSoundEnabled(!enabled)}
      aria-pressed={enabled}
      aria-label={enabled ? "Turn interface sounds off" : "Turn interface sounds on"}
      title={enabled ? "Sound on" : "Sound off"}
      className={cn(
        "grid size-10 place-items-center rounded-full border-[1.5px] transition-colors",
        enabled ? "border-ink bg-ink text-paper" : "border-line-strong text-ink hover:border-ink",
        className,
      )}
    >
      {enabled ? <LuVolume2 className="size-4" /> : <LuVolumeX className="size-4" />}
    </button>
  );
}
