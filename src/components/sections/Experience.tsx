"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { LuArrowUpRight, LuMapPin, LuMinus, LuPlus } from "react-icons/lu";
import { experience, type Experience as Exp } from "@/data/experience";
import { getProject } from "@/data/projects";
import { profile } from "@/data/profile";
import { EASE } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Spotlight } from "@/components/ui/Spotlight";
import { TechChip } from "@/components/ui/TechIcon";

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 65%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 28 });

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-32 md:py-44">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,color-mix(in_oklab,var(--color-violet)_10%,transparent),transparent_55%)]" />
      <div className="container-x relative grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div id="experience-title">
              <SectionHeading
                index="03"
                kicker="Experience"
                size="md"
                parts={["Experience builds", { text: "perspective.", className: "italic text-gradient" }]}
              />
            </div>
            <Reveal delay={0.1} className="mt-10">
              <blockquote className="border-l border-lilac/50 pl-5 font-display text-2xl italic leading-snug text-ink/85">
                “Not just experience — lessons that make every next product better.”
              </blockquote>
            </Reveal>
            <Reveal delay={0.2} className="mt-12 grid grid-cols-3 gap-4 border-t border-line pt-8">
              {[
                { v: "4+", l: "Years" },
                { v: `${experience.length - 1}`, l: "Companies" },
                { v: "25+", l: "Projects" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-4xl text-ink">{s.v}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-dim">{s.l}</p>
                </div>
              ))}
            </Reveal>
            <Reveal delay={0.25} className="mt-8 flex items-center gap-2 text-sm text-mist">
              <LuMapPin className="text-lilac" /> Based in {profile.location} · working worldwide
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7 xl:col-span-8">
          <ol ref={listRef} className="relative space-y-8 pl-10 md:pl-16">
            <span aria-hidden className="absolute bottom-0 left-[7px] top-2 w-px bg-line md:left-[11px]" />
            <motion.span
              aria-hidden
              style={{ scaleY }}
              className="absolute bottom-0 left-[7px] top-2 w-px origin-top bg-linear-to-b from-violet via-lilac to-cyan shadow-[0_0_12px_color-mix(in_oklab,var(--color-violet)_90%,transparent)] md:left-[11px]"
            />
            {experience.map((item, i) => (
              <ExperienceItem key={item.company} item={item} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ExperienceItem({ item, index }: { item: Exp; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const visible = item.bullets.slice(0, 2);
  const extra = item.bullets.slice(2);
  const related = item.projects.map(getProject).filter((p) => p !== undefined);

  return (
    <li className="relative">
      <motion.span
        aria-hidden
        initial={{ scale: 0.4, opacity: 0.3 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ amount: 1, margin: "-30% 0px -30% 0px" }}
        transition={{ duration: 0.5 }}
        className="absolute -left-10 top-9 grid size-[15px] place-items-center rounded-full border border-lilac bg-paper shadow-[0_0_18px_color-mix(in_oklab,var(--color-violet)_90%,transparent)] md:-left-16 md:size-[23px]"
      >
        <span className="size-1.5 rounded-full bg-lilac md:size-2" />
      </motion.span>

      <Reveal>
        <Spotlight as="article" className="rounded-3xl border border-line bg-paper-2/85 p-6 backdrop-blur-sm md:p-9">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-lilac">{item.period}</span>
            <span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
              {item.type}
            </span>
          </div>
          <h3 className="mt-5 font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight text-ink">{item.role}</h3>
          <p className="mt-1 text-base text-ink/80">
            {item.company} <span className="text-dim">· {item.location}</span>
          </p>
          <p className="mt-5 max-w-2xl leading-relaxed text-mist">{item.summary}</p>

          <ul className="mt-6 space-y-3">
            {visible.map((b) => (
              <Bullet key={b}>{b}</Bullet>
            ))}
          </ul>
          <AnimatePresence initial={false}>
            {open && extra.length > 0 && (
              <motion.ul
                key="extra"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="space-y-3 overflow-hidden pt-3"
              >
                {extra.map((b) => (
                  <Bullet key={b}>{b}</Bullet>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {extra.length > 0 && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-lilac transition-colors hover:text-ink"
            >
              {open ? <LuMinus /> : <LuPlus />}
              {open ? "Show less" : `Show ${extra.length} more`}
            </button>
          )}

          <div className="mt-7 flex flex-wrap gap-2 border-t border-line pt-6">
            {item.stack.map((t) => (
              <TechChip key={t} name={t} />
            ))}
          </div>

          {related.length > 0 && (
            <div className="mt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">Shipped here</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    scroll={false}
                    data-cursor="view"
                    data-cursor-label="Open"
                    className="group inline-flex items-center gap-2 rounded-full bg-ink/[0.04] px-4 py-2 text-sm text-ink ring-1 ring-line transition-all hover:bg-ink/[0.08] hover:ring-lilac/50"
                  >
                    <span className="size-1.5 rounded-full" style={{ background: p.accent }} />
                    {p.title}
                    <LuArrowUpRight className="text-mist transition-transform duration-300 group-hover:rotate-45" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Spotlight>
      </Reveal>
    </li>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-[15px] leading-relaxed text-ink/80">
      <span aria-hidden className="mt-[0.65em] h-px w-4 shrink-0 bg-lilac/70" />
      <span>{children}</span>
    </li>
  );
}
