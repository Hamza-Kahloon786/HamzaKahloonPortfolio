"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { LuArrowUp, LuMail } from "react-icons/lu";
import { profile } from "@/data/profile";
import { site } from "@/lib/site";
import { scrollToTarget } from "@/lib/scroll";
import { Magnetic } from "@/components/ui/Magnetic";
import { NAV_LINKS } from "./Navbar";

const noop = () => () => {};

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const year = useSyncExternalStore(noop, () => new Date().getFullYear(), () => Number(site.updated.slice(0, 4)));

  return (
    <footer className="theme-invert relative overflow-hidden rounded-t-[32px] bg-paper pt-20 text-ink md:rounded-t-[56px]">
      <div aria-hidden className="pointer-events-none absolute -top-40 right-[-8%] h-[28rem] w-[28rem] rounded-full bg-violet/25 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 left-[-10%] h-[24rem] w-[24rem] rounded-full bg-cyan/15 blur-[130px]" />
      <div className="container-x relative">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-3xl leading-tight text-ink">
              Same curiosity. <span className="italic text-gradient">A brighter tomorrow.</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist">
              {profile.title} based in {profile.location}. Building AI voice agents, RAG systems and SaaS platforms for teams worldwide.
            </p>
          </div>
          <nav aria-label="Footer" className="md:col-span-3">
            <p className="kicker">Navigate</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/#${l.id}`}
                    onClick={(e) => {
                      if (!isHome) return;
                      e.preventDefault();
                      scrollToTarget(l.id === "home" ? 0 : `#${l.id}`);
                    }}
                    className="text-mist transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4">
            <p className="kicker">Elsewhere</p>
            <ul className="mt-5 flex flex-wrap gap-3">
              {[
                { href: `mailto:${profile.email}`, icon: LuMail, label: "Email" },
                { href: profile.linkedin, icon: FaLinkedinIn, label: "LinkedIn" },
                { href: profile.github, icon: FaGithub, label: "GitHub" },
                { href: profile.whatsapp, icon: FaWhatsapp, label: "WhatsApp" },
              ].map((s) => (
                <li key={s.label}>
                  <Magnetic>
                    <a
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={s.label}
                      className="grid size-12 place-items-center rounded-full border border-line text-mist transition-all duration-300 hover:border-lilac hover:bg-violet/20 hover:text-ink"
                    >
                      <s.icon />
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative mt-20 select-none px-2" aria-hidden>
        <p className="flex justify-center whitespace-nowrap font-display text-[clamp(2.6rem,12.4vw,14rem)] font-medium leading-[0.8] tracking-[-0.04em]">
          {profile.name.split("").map((ch, i) =>
            ch === " " ? (
              <span key={i} className="inline-block w-[0.28em]" />
            ) : (
              <span
                key={i}
                className="text-outline inline-block transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-[0.08em] hover:text-lilac hover:[-webkit-text-stroke:0]"
              >
                {ch}
              </span>
            ),
          )}
        </p>
      </div>

      <div className="container-x relative mt-10 flex flex-col items-center justify-between gap-4 border-t border-line py-6 text-xs text-dim md:flex-row">
        <p>
          © {year} {profile.name}. Designed & built with Next.js, Motion and a lot of chai.
        </p>
        <button
          type="button"
          onClick={() => scrollToTarget(0)}
          className="group inline-flex items-center gap-2 font-mono uppercase tracking-[0.24em] text-mist transition-colors hover:text-ink"
        >
          Back to top
          <span className="grid size-9 place-items-center rounded-full border border-line transition-all group-hover:-translate-y-1 group-hover:border-lilac">
            <LuArrowUp />
          </span>
        </button>
      </div>
    </footer>
  );
}
