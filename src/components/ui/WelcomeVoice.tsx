"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuX } from "react-icons/lu";
import { soundStore } from "@/lib/sound";
import { EASE } from "@/lib/utils";

const SRC = "/audio/welcome.mp3";
const SESSION_KEY = "hk-welcome";
const GESTURES = ["pointerdown", "keydown", "touchend"] as const;

/**
 * Plays the spoken welcome once per visit. Browsers block sound until the visitor interacts,
 * so it tries right away and otherwise plays on the first click, tap or key press.
 * Skipped for visitors who turned sounds off; stopped when the AI assistant opens or a voice call starts.
 */
export function WelcomeVoice() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1" || localStorage.getItem("hk-sound") === "0") return;
    } catch {}

    const audio = new Audio(SRC);
    audio.preload = "auto";
    audio.volume = 0.9;
    audioRef.current = audio;
    let done = false;

    const detach = () => GESTURES.forEach((g) => window.removeEventListener(g, onGesture, true));
    const finish = () => {
      done = true;
      detach();
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
    };
    const stop = () => {
      audio.pause();
      setPlaying(false);
      finish();
    };
    function tryPlay() {
      if (done) return;
      audio
        .play()
        .then(() => {
          finish();
          setPlaying(true);
        })
        .catch(() => {
          /* Autoplay blocked — wait for the first interaction. */
        });
    }

    // If the first interaction opens the AI assistant, skip the welcome entirely.
    function onGesture(e: Event) {
      if ((e.target as Element | null)?.closest?.("[data-assistant-trigger]")) finish();
      else tryPlay();
    }

    audio.addEventListener("ended", () => setPlaying(false));
    GESTURES.forEach((g) => window.addEventListener(g, onGesture, { capture: true, passive: true }));
    window.addEventListener("assistant:open", stop);
    window.addEventListener("assistant:voice", stop);
    // Turning sounds off (explicitly) silences the welcome too.
    const unsubscribe = soundStore.subscribe(() => {
      try {
        if (localStorage.getItem("hk-sound") === "0") stop();
      } catch {}
    });
    const timer = setTimeout(tryPlay, 700);

    return () => {
      clearTimeout(timer);
      detach();
      window.removeEventListener("assistant:open", stop);
      window.removeEventListener("assistant:voice", stop);
      unsubscribe();
      audio.pause();
    };
  }, []);

  const stop = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="fixed bottom-4 left-4 z-[86] flex items-center gap-3 rounded-full border border-line-strong bg-paper/95 py-1.5 pl-2 pr-1.5 shadow-[0_18px_40px_-16px_rgba(10,19,17,0.45)] backdrop-blur-xl md:bottom-6 md:left-6"
        >
          <span className="grid size-8 place-items-center rounded-full bg-linear-to-br from-violet to-cyan" aria-hidden>
            <span className="flex h-3.5 items-end gap-[2px]">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="w-[3px] origin-bottom rounded-full bg-white"
                  style={{ height: "100%" }}
                  animate={{ scaleY: [0.35, 1, 0.5, 0.85, 0.35] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
                />
              ))}
            </span>
          </span>
          <span className="text-xs leading-tight">
            <span className="block font-semibold text-ink">Welcome message</span>
            <span className="block text-dim">AI voice</span>
          </span>
          <button
            type="button"
            onClick={stop}
            aria-label="Stop welcome message"
            className="grid size-8 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            <LuX className="size-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
