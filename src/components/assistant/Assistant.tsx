"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuArrowUpRight, LuLoaderCircle, LuMic, LuPhoneOff, LuSend, LuSparkles, LuX } from "react-icons/lu";
import { getProject } from "@/data/projects";
import { ASSISTANT_SECTIONS, CHAT_MAX_CHARS, VOICE_MAX_SECONDS, parseMarkers, type AssistantSection } from "@/lib/assistant/shared";
import { scrollToTarget } from "@/lib/scroll";
import { play } from "@/lib/sound";
import { cn, EASE } from "@/lib/utils";
import { useVoiceCall, type VoiceHandlers } from "./useVoiceCall";

type Message = {
  id: string;
  role: "user" | "assistant" | "action";
  text: string;
  pending?: boolean;
};

const SUGGESTIONS = [
  "What does Hamza specialise in?",
  "Show me his AI voice agent work",
  "Which projects use RAG?",
  "Is he available for hire?",
];

const SECTION_LABEL: Record<AssistantSection, string> = {
  about: "Journey",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  certifications: "Certifications",
  faq: "FAQ",
  contact: "Contact",
};

let seq = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${(seq++).toString(36)}`;

/** Opens the assistant from anywhere (hero button, command palette). */
export function openAssistant(mode: "voice" | "text" = "text") {
  window.dispatchEvent(new CustomEvent("assistant:open", { detail: { mode } }));
}

export function Assistant() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const messagesRef = useRef<Message[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef(pathname);

  useLayoutEffect(() => {
    messagesRef.current = messages;
    pathRef.current = pathname;
  });

  const upsert = useCallback((id: string, role: Message["role"], update: (m: Message) => Message) => {
    setMessages((list) => {
      const i = list.findIndex((m) => m.id === id);
      if (i === -1) return [...list, update({ id, role, text: "" })];
      const next = list.slice();
      next[i] = update(list[i]);
      return next;
    });
  }, []);

  const addAction = useCallback((text: string) => {
    setMessages((list) => [...list, { id: uid("act"), role: "action", text }]);
  }, []);

  const goSection = useCallback(
    (section: AssistantSection) => {
      if (pathRef.current === "/") scrollToTarget(`#${section}`);
      else router.push(`/#${section}`);
    },
    [router],
  );

  const openProject = useCallback(
    (slug: string) => {
      const p = getProject(slug);
      if (!p) return null;
      router.push(`/projects/${p.slug}`, { scroll: false });
      return p;
    },
    [router],
  );

  const handlers: VoiceHandlers = {
    userTurn: (id) => upsert(id, "user", (m) => ({ ...m, pending: true })),
    userText: (id, text) =>
      text ? upsert(id, "user", (m) => ({ ...m, text, pending: false })) : setMessages((l) => l.filter((m) => m.id !== id)),
    assistantDelta: (id, delta) => upsert(id, "assistant", (m) => ({ ...m, text: m.text + delta, pending: true })),
    assistantDone: (id, text) => upsert(id, "assistant", (m) => ({ ...m, text: text || m.text, pending: false })),
    tool: (name, args) => {
      if (name === "open_project") {
        const p = openProject(String(args.slug));
        if (!p) return JSON.stringify({ ok: false, error: "Unknown project" });
        addAction(`Opened ${p.title}`);
        return JSON.stringify({ ok: true, opened: p.title });
      }
      if (name === "show_section" && ASSISTANT_SECTIONS.includes(args.section as AssistantSection)) {
        const section = args.section as AssistantSection;
        goSection(section);
        addAction(`Showing ${SECTION_LABEL[section]}`);
        return JSON.stringify({ ok: true });
      }
      return JSON.stringify({ ok: false, error: "Unknown tool" });
    },
    ended: (reason) => {
      if (reason === "limit") addAction(`Call ended at the ${VOICE_MAX_SECONDS / 60}-minute limit — keep going by text.`);
    },
  };
  const voice = useVoiceCall(handlers);
  const startVoice = voice.start;

  // Open from anywhere via openAssistant(); "voice" starts a call straight away.
  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      if ((e as CustomEvent<{ mode?: string }>).detail?.mode === "voice") void startVoice();
    };
    window.addEventListener("assistant:open", onOpen);
    return () => window.removeEventListener("assistant:open", onOpen);
  }, [startVoice]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector('[aria-modal="true"]')) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const close = () => {
    voice.stop("user");
    setOpen(false);
  };

  const send = async (raw: string) => {
    const text = raw.trim().slice(0, CHAT_MAX_CHARS);
    if (!text || busy) return;
    setInput("");
    const user: Message = { id: uid("u"), role: "user", text };
    const replyId = uid("a");
    const history = [...messagesRef.current, user]
      .filter((m) => m.role !== "action" && m.text && !m.pending)
      .map((m) => ({ role: m.role, content: m.text }));
    setMessages((l) => [...l, user, { id: replyId, role: "assistant", text: "", pending: true }]);
    setBusy(true);
    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Sorry — I couldn't answer that right now.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        upsert(replyId, "assistant", (m) => ({ ...m, text: m.text + chunk }));
      }
    } catch (err) {
      upsert(replyId, "assistant", (m) => ({
        ...m,
        text: err instanceof Error ? err.message : "Sorry — I couldn't answer that right now.",
      }));
    } finally {
      upsert(replyId, "assistant", (m) => ({ ...m, pending: false }));
      setBusy(false);
    }
  };

  const live = voice.status === "live";
  const connecting = voice.status === "connecting";
  const remaining = Math.max(0, VOICE_MAX_SECONDS - voice.seconds);

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            type="button"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={() => {
              play("open");
              openAssistant();
            }}
            aria-label="Open Hamza's AI assistant"
            data-assistant-trigger=""
            className="group fixed bottom-4 right-4 z-[86] flex items-center gap-3 rounded-full bg-ink py-2 pl-2 pr-5 text-sm font-semibold text-paper shadow-[0_18px_40px_-14px_rgba(10,19,17,0.55)] transition-transform hover:-translate-y-0.5 md:bottom-6 md:right-6"
          >
            <span className="relative grid size-9 place-items-center">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-violet/70" />
              <span className="relative grid size-9 place-items-center rounded-full bg-linear-to-br from-violet to-cyan">
                <LuSparkles className="size-4 text-white" />
              </span>
            </span>
            Ask my AI
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.section
            key="panel"
            role="dialog"
            aria-label="Hamza's AI assistant"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-x-2 bottom-2 z-[86] flex h-[min(82svh,660px)] origin-bottom-right flex-col overflow-hidden rounded-[26px] border border-line-strong bg-paper shadow-[0_40px_100px_-30px_rgba(10,19,17,0.55)] md:inset-x-auto md:bottom-6 md:right-6 md:w-[410px]"
          >
            <header className="flex items-center gap-3 border-b border-line px-5 py-4">
              <span className="grid size-10 place-items-center rounded-full bg-linear-to-br from-violet to-cyan text-white">
                <LuSparkles />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-display text-[15px] font-semibold text-ink">
                  Hamza&apos;s AI assistant
                  <span className="rounded-full bg-violet/12 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-lilac">AI</span>
                </p>
                <p className="truncate text-xs text-mist">Ask about projects, skills &amp; availability — by voice or text</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close assistant"
                className="grid size-9 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                <LuX />
              </button>
            </header>

            <div className={cn("flex items-center gap-4 border-b border-line px-5 transition-all", messages.length ? "py-3" : "flex-col py-7")}>
              <VoiceOrb level={voice.level} active={live} speaker={voice.speaker} large={!messages.length} />
              <div className={cn("min-w-0 flex-1", !messages.length && "text-center")}>
                <p className="text-sm font-semibold text-ink" aria-live="polite">
                  {connecting
                    ? "Connecting…"
                    : live
                      ? voice.speaker === "assistant"
                        ? "Speaking…"
                        : voice.speaker === "user"
                          ? "Listening…"
                          : "Go ahead — I'm listening"
                      : "Talk to me — it's a real voice conversation"}
                </p>
                <p className="mt-0.5 text-xs text-mist">
                  {live
                    ? `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")} left · ask me anything about Hamza`
                    : voice.error ?? "Uses your microphone. Voice is processed by OpenAI."}
                </p>
              </div>
              {live || connecting ? (
                <button
                  type="button"
                  onClick={() => voice.stop("user")}
                  disabled={connecting}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                >
                  {connecting ? <LuLoaderCircle className="animate-spin" /> : <LuPhoneOff />}
                  {connecting ? "Wait" : "End"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void voice.start()}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-violet"
                >
                  <LuMic /> {messages.length ? "Call" : "Start voice call"}
                </button>
              )}
            </div>

            <div ref={listRef} data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 py-4">
              {messages.length === 0 ? (
                <div>
                  <p className="text-sm text-mist">Or pick a question to start:</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => void send(s)}
                        className="rounded-full border border-line-strong px-3.5 py-2 text-left text-sm text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) =>
                  m.role === "action" ? (
                    <p key={m.id} className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                      {m.text}
                    </p>
                  ) : (
                    <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed",
                          m.role === "user" ? "rounded-br-md bg-ink text-paper" : "rounded-bl-md bg-paper-2 text-ink",
                        )}
                      >
                        {m.text ? (
                          <MessageText text={m.text} onProject={openProject} onSection={goSection} />
                        ) : (
                          <TypingDots />
                        )}
                      </div>
                    </div>
                  ),
                )
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="flex items-center gap-2 border-t border-line px-4 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={CHAT_MAX_CHARS}
                placeholder={live ? "Or type a message…" : "Ask about Hamza's work…"}
                aria-label="Message the assistant"
                className="h-11 min-w-0 flex-1 rounded-full border border-line-strong bg-paper-2 px-4 text-sm text-ink outline-none transition-colors placeholder:text-dim focus:border-ink"
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                aria-label="Send message"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-violet disabled:opacity-40"
              >
                {busy ? <LuLoaderCircle className="animate-spin" /> : <LuSend />}
              </button>
            </form>
            <p className="px-5 pb-3 text-[10.5px] leading-snug text-dim">
              AI answers can be wrong — confirm important details with Hamza directly.
            </p>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageText({
  text,
  onProject,
  onSection,
}: {
  text: string;
  onProject: (slug: string) => unknown;
  onSection: (section: AssistantSection) => void;
}) {
  return (
    <>
      {parseMarkers(text).map((part, i) => {
        if (part.type === "text") return <span key={i} className="whitespace-pre-wrap">{part.value}</span>;
        if (part.type === "project") {
          const p = getProject(part.value);
          if (!p) return null;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onProject(p.slug)}
              className="mx-0.5 inline-flex translate-y-[2px] items-center gap-1 rounded-full border border-line-strong bg-paper px-2.5 py-0.5 text-xs font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <span className="size-1.5 rounded-full" style={{ background: p.accent }} />
              {p.title}
              <LuArrowUpRight className="size-3" />
            </button>
          );
        }
        const section = part.value as AssistantSection;
        if (!ASSISTANT_SECTIONS.includes(section)) return null;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSection(section)}
            className="mx-0.5 inline-flex translate-y-[2px] items-center gap-1 rounded-full border border-line-strong bg-paper px-2.5 py-0.5 text-xs font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            {SECTION_LABEL[section]}
            <LuArrowUpRight className="size-3" />
          </button>
        );
      })}
    </>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-1.5 animate-bounce rounded-full bg-dim" style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
    </span>
  );
}

/** Gradient orb that breathes with the live audio level (read from a ref, no re-renders). */
function VoiceOrb({
  level,
  active,
  speaker,
  large,
}: {
  level: { current: number };
  active: boolean;
  speaker: "user" | "assistant" | null;
  large: boolean;
}) {
  const core = useRef<HTMLSpanElement>(null);
  const halo = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      const idle = active ? 0 : 0.04 * (1 + Math.sin(t / 700));
      const v = active ? level.current : idle;
      if (core.current) core.current.style.transform = `scale(${1 + v * 0.35})`;
      if (halo.current) {
        halo.current.style.transform = `scale(${1.05 + v * 0.9})`;
        halo.current.style.opacity = String(0.25 + v * 0.6);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, level]);

  return (
    <span className={cn("relative grid shrink-0 place-items-center", large ? "size-28" : "size-12")} aria-hidden>
      <span ref={halo} className="absolute inset-0 rounded-full bg-linear-to-br from-violet/50 to-cyan/50 blur-md transition-[filter]" />
      <span
        ref={core}
        className={cn(
          "relative size-[78%] rounded-full bg-[radial-gradient(circle_at_32%_28%,#ffffff_0%,var(--color-cyan)_28%,var(--color-violet)_62%,var(--color-violet-deep)_100%)] shadow-[inset_0_-8px_20px_rgba(0,0,0,0.18)]",
          speaker === "user" && "ring-4 ring-cyan/40",
        )}
      />
    </span>
  );
}
