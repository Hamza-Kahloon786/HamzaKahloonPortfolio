"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { LuCommand } from "react-icons/lu";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { profile } from "@/data/profile";
import { lockScroll, scrollToTarget, unlockScroll } from "@/lib/scroll";
import { cn, EASE, pad2 } from "@/lib/utils";
import { Magnetic } from "@/components/ui/Magnetic";
import { SoundToggle } from "@/components/ui/SoundEffects";

export const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "Journey" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
] as const;

export function openPalette() {
  window.dispatchEvent(new CustomEvent("palette:open"));
}

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [active, setActive] = useState<string>("home");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(v > 40);
    setHidden(v > prev && v > 480);
  });

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const l of NAV_LINKS) {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Jumps chosen from the open mobile menu wait until it has closed and released the scroll lock.
  const pendingJump = useRef<string | null>(null);
  useEffect(() => {
    if (open || !pendingJump.current) return;
    const id = pendingJump.current;
    pendingJump.current = null;
    scrollToTarget(id === "home" ? 0 : `#${id}`);
  }, [open]);

  const go = (e: React.MouseEvent, id: string) => {
    if (!isHome) {
      setOpen(false);
      return;
    }
    e.preventDefault();
    if (open) {
      pendingJump.current = id;
      setOpen(false);
    } else {
      scrollToTarget(id === "home" ? 0 : `#${id}`);
    }
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "transition-[background-color,border-color,backdrop-filter] duration-500",
            scrolled && !open ? "border-b border-line bg-paper/70 backdrop-blur-xl" : "border-b border-transparent",
          )}
        >
          <nav aria-label="Primary" className="container-x flex h-[72px] items-center justify-between gap-6">
            <Link href="/" onClick={(e) => go(e, "home")} className="group flex items-center gap-3" aria-label="Hamza Kahloon — home">
              <span className="relative grid size-10 place-items-center rounded-full bg-ink font-display text-sm font-bold tracking-wider text-paper transition-colors duration-500 group-hover:bg-violet">
                HK
                <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-emerald-400 ring-4 ring-paper" />
              </span>
              <span className="hidden flex-col font-mono text-[9px] font-semibold uppercase leading-[1.5] tracking-[0.24em] text-ink/55 sm:flex">
                <span className="text-ink">Developer</span>
                <span>AI Engineer</span>
                <span>Builder</span>
              </span>
            </Link>

            <ul className="hidden items-center gap-1 xl:flex">
              {NAV_LINKS.map((l) => {
                const isActive = isHome && active === l.id;
                return (
                  <li key={l.id}>
                    <Link
                      href={`/#${l.id}`}
                      onClick={(e) => go(e, l.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "group relative block px-3.5 py-2 font-display text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300",
                        isActive ? "text-ink" : "text-ink/75 hover:text-ink",
                      )}
                    >
                      <span className="relative block overflow-hidden">
                        <span className="block transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-full">
                          {l.label}
                        </span>
                        <span aria-hidden className="absolute inset-0 translate-y-full text-lilac transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0">
                          {l.label}
                        </span>
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-3.5 -bottom-0.5 h-[3px] rounded-full bg-violet"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2 sm:gap-3">
              <SoundToggle />
              <button
                type="button"
                onClick={openPalette}
                className="hidden items-center gap-2 rounded-full border-[1.5px] border-ink px-3.5 py-2 font-mono text-[11px] font-bold text-ink transition-colors hover:bg-ink hover:text-paper md:flex"
                aria-label="Open command menu"
              >
                <LuCommand className="size-3.5" /> K
              </button>
              <Magnetic className="hidden sm:inline-block">
                <Link
                  href="/#contact"
                  onClick={(e) => go(e, "contact")}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper"
                >
                  <span className="absolute inset-0 translate-y-full rounded-full bg-linear-to-r from-violet to-cyan transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0" />
                  <span className="relative transition-colors duration-500 group-hover:text-white">Let&apos;s talk</span>
                </Link>
              </Magnetic>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="relative grid size-11 place-items-center rounded-full border border-line xl:hidden"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                <span className="relative block h-3 w-5">
                  <span className={cn("absolute left-0 top-0 h-px w-5 bg-ink transition-transform duration-500", open && "translate-y-1.5 rotate-45")} />
                  <span className={cn("absolute bottom-0 left-0 h-px w-5 bg-ink transition-transform duration-500", open && "-translate-y-1.5 -rotate-45")} />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-paper/95 pt-24 backdrop-blur-2xl xl:hidden"
          >
            <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
            <ul className="container-x relative flex flex-1 flex-col justify-center gap-1">
              {NAV_LINKS.map((l, i) => (
                <li key={l.id} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.05 }}
                  >
                    <Link
                      href={`/#${l.id}`}
                      onClick={(e) => go(e, l.id)}
                      className="group flex items-baseline gap-4 py-1 font-display text-[clamp(2.2rem,9vw,4rem)] leading-none"
                    >
                      <span className="font-mono text-xs text-lilac">{pad2(i + 1)}</span>
                      <span className="transition-[letter-spacing,color] duration-500 group-hover:tracking-wide group-hover:text-lilac">{l.label}</span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
              className="container-x relative flex flex-wrap items-center justify-between gap-4 border-t border-line py-6"
            >
              <a href={`mailto:${profile.email}`} className="text-sm text-mist hover:text-ink">
                {profile.email}
              </a>
              <div className="flex gap-3">
                {[
                  { href: profile.github, icon: FaGithub, label: "GitHub" },
                  { href: profile.linkedin, icon: FaLinkedinIn, label: "LinkedIn" },
                  { href: profile.whatsapp, icon: FaWhatsapp, label: "WhatsApp" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid size-11 place-items-center rounded-full border border-line text-mist transition-colors hover:border-lilac hover:text-ink"
                  >
                    <s.icon />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
