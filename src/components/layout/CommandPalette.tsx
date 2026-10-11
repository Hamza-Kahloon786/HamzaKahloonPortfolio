"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { LuCopy, LuCornerDownLeft, LuHash, LuMessageCircle, LuMic, LuSearch } from "react-icons/lu";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { lockScroll, scrollToTarget, unlockScroll } from "@/lib/scroll";
import { cn, EASE } from "@/lib/utils";
import { ProjectGlyph } from "@/components/project/ProjectCover";
import { openAssistant } from "@/components/assistant/Assistant";
import { NAV_LINKS } from "./Navbar";

type Item = { id: string; group: string; label: string; hint?: string; icon: React.ReactNode; run: () => void };

export function CommandPalette({ assistant = false }: { assistant?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, []);

  return <AnimatePresence>{open && <Palette key="palette" assistant={assistant} onClose={() => setOpen(false)} />}</AnimatePresence>;
}

function Palette({ onClose, assistant }: { onClose: () => void; assistant: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const items = useMemo<Item[]>(() => {
    const goSection = (id: string) => () => {
      if (pathname === "/") scrollToTarget(id === "home" ? 0 : `#${id}`);
      else router.push(`/#${id}`);
    };
    return [
      ...NAV_LINKS.map((l) => ({
        id: `nav-${l.id}`,
        group: "Navigate",
        label: l.label,
        hint: "Section",
        icon: <LuHash />,
        run: goSection(l.id),
      })),
      ...projects.map((p) => ({
        id: `p-${p.slug}`,
        group: "Projects",
        label: p.title,
        hint: p.tagline,
        icon: <ProjectGlyph glyph={p.glyph} style={{ color: p.accent }} />,
        run: () => router.push(`/projects/${p.slug}`, { scroll: false }),
      })),
      ...(assistant
        ? [
            { id: "ai-voice", group: "Ask my AI", label: "Talk to my AI by voice", hint: "Real-time voice conversation", icon: <LuMic />, run: () => openAssistant("voice") },
            { id: "ai-text", group: "Ask my AI", label: "Chat with my AI", hint: "Ask about projects, skills and availability", icon: <LuMessageCircle />, run: () => openAssistant("text") },
          ]
        : []),
      {
        id: "copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        icon: <LuCopy />,
        run: () => void navigator.clipboard?.writeText(profile.email),
      },
      { id: "gh", group: "Actions", label: "Open GitHub", hint: "github.com", icon: <FaGithub />, run: () => window.open(profile.github, "_blank", "noopener") },
      { id: "li", group: "Actions", label: "Open LinkedIn", hint: "linkedin.com", icon: <FaLinkedinIn />, run: () => window.open(profile.linkedin, "_blank", "noopener") },
      { id: "wa", group: "Actions", label: "Message on WhatsApp", hint: profile.phone, icon: <FaWhatsapp />, run: () => window.open(profile.whatsapp, "_blank", "noopener") },
    ];
  }, [pathname, router, assistant]);

  const q = query.trim().toLowerCase();
  const filtered = q ? items.filter((i) => `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase().includes(q)) : items;
  const active = Math.min(cursor, Math.max(0, filtered.length - 1));

  useEffect(() => {
    lockScroll();
    inputRef.current?.focus();
    return () => unlockScroll();
  }, []);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (item: Item | undefined) => {
    if (!item) return;
    onClose();
    item.run();
  };

  let lastGroup = "";

  return (
    <motion.div className="fixed inset-0 z-[95] flex items-start justify-center px-4 pt-[14vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-paper/75 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        initial={{ y: -20, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: -10, scale: 0.98 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line-strong bg-paper-2/95 shadow-[0_40px_120px_-20px_rgba(16,16,24,0.22)] backdrop-blur-2xl"
      >
        <div className="flex items-center gap-3 border-b border-line px-5">
          <LuSearch className="text-mist" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                run(filtered[active]);
              } else if (e.key === "Escape") {
                onClose();
              }
            }}
            placeholder="Jump to a section, open a project…"
            aria-label="Search commands"
            className="h-14 flex-1 bg-transparent text-ink outline-none placeholder:text-dim"
          />
          <kbd className="rounded-md border border-line px-2 py-1 font-mono text-[10px] text-dim">ESC</kbd>
        </div>
        <ul ref={listRef} data-lenis-prevent className="max-h-[52vh] overflow-y-auto p-2">
          {filtered.length === 0 && <li className="px-4 py-10 text-center text-sm text-mist">No results for “{query}”.</li>}
          {filtered.map((item, i) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            return (
              <li key={item.id}>
                {header && <p className="px-3 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-dim">{header}</p>}
                <button
                  type="button"
                  data-index={i}
                  onMouseMove={() => setCursor(i)}
                  onClick={() => run(item)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    i === active ? "bg-ink/[0.07] text-ink" : "text-ink/80",
                  )}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-paper text-mist">{item.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{item.label}</span>
                    {item.hint && <span className="block truncate text-xs text-dim">{item.hint}</span>}
                  </span>
                  {i === active && <LuCornerDownLeft className="shrink-0 text-lilac" />}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center justify-between border-t border-line px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
          <span>↑↓ navigate · ↵ open</span>
          <span>Ctrl / ⌘ + K</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
