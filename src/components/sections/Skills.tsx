"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { LuArrowUpRight, LuX } from "react-icons/lu";
import { projectsUsing } from "@/data/projects";
import { allSkills, skillGroups } from "@/data/skills";
import { cn, EASE, pad2 } from "@/lib/utils";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Portal } from "@/components/ui/Portal";
import { Spotlight } from "@/components/ui/Spotlight";
import { TechIcon, techMeta } from "@/components/ui/TechIcon";

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgX = useTransform(scrollYProgress, [0, 1], ["8%", "-28%"]);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) setSelected(null);
    });
    io.observe(section);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <section ref={ref} id="skills" aria-labelledby="skills-title" className="relative overflow-hidden py-32 md:py-44">
      <motion.p
        aria-hidden
        style={{ x: bgX }}
        className="text-outline pointer-events-none absolute left-0 top-24 select-none whitespace-nowrap font-display text-[clamp(8rem,24vw,22rem)] leading-none opacity-30"
      >
        SKILLS · TOOLS · CRAFT
      </motion.p>

      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div id="skills-title">
            <SectionHeading
              index="02"
              kicker="Skills"
              parts={["The stack behind", { text: "the products.", className: "italic text-gradient" }]}
              intro="Click any tool to see exactly where I've used it in real projects."
            />
          </div>
          <Reveal className="flex gap-10 lg:pb-3">
            <div>
              <p className="font-display text-5xl text-ink">{allSkills.length}+</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-dim">Tools & tech</p>
            </div>
            <div>
              <p className="font-display text-5xl text-ink">{skillGroups.length}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-dim">Disciplines</p>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {skillGroups.map((group, gi) => (
            <Reveal key={group.title} delay={(gi % 3) * 0.08} className="md:last:col-span-2 xl:last:col-span-1">
              <Spotlight className="h-full rounded-3xl border border-line bg-paper-2/85 p-6 backdrop-blur-sm md:p-7">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-2xl text-lilac">{pad2(gi + 1)}</span>
                  <h3 className="font-display text-xl uppercase tracking-[0.06em] text-ink">{group.title}</h3>
                  <span className="mx-2 hidden h-px flex-1 bg-line sm:block" />
                  <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-dim sm:block">{group.motto}</span>
                </div>
                <ul className="mt-7 grid grid-cols-4 gap-2.5 sm:grid-cols-5">
                  {group.items.map((name) => {
                    const meta = techMeta(name);
                    const active = selected === name;
                    return (
                      <li key={name}>
                        <button
                          type="button"
                          onClick={() => setSelected(active ? null : name)}
                          aria-pressed={active}
                          style={{ ["--c" as string]: meta.color }}
                          className={cn(
                            "group/tile flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border bg-paper/70 p-2 transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--c)] hover:shadow-[0_10px_30px_-12px_var(--c)]",
                            active ? "border-[color:var(--c)] shadow-[0_0_0_1px_var(--c),0_10px_30px_-10px_var(--c)]" : "border-line",
                          )}
                        >
                          <TechIcon name={name} size={24} className="transition-transform duration-300 group-hover/tile:scale-110" />
                          <span className="line-clamp-2 text-center text-[10px] leading-[1.15] text-mist transition-colors group-hover/tile:text-ink">
                            {name}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-24 space-y-4">
        <Marquee duration={60}>
          {allSkills.slice(0, Math.ceil(allSkills.length / 2)).map((s) => (
            <span key={s} className="mx-6 flex items-center gap-4 font-display text-4xl text-ink/80 md:text-6xl">
              {s}
              <span className="text-lilac">✦</span>
            </span>
          ))}
        </Marquee>
        <Marquee duration={70} reverse>
          {allSkills.slice(Math.ceil(allSkills.length / 2)).map((s) => (
            <span key={s} className="text-outline mx-6 flex items-center gap-4 font-display text-4xl italic md:text-6xl">
              {s}
              <span className="text-cyan not-italic [-webkit-text-stroke:0]">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Portal>
        <AnimatePresence>{selected && <SkillInspector key={selected} name={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
      </Portal>
    </section>
  );
}

function SkillInspector({ name, onClose }: { name: string; onClose: () => void }) {
  const used = projectsUsing(name);
  const meta = techMeta(name);
  return (
    <motion.div
      role="dialog"
      aria-label={`${name} — where it's used`}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl rounded-3xl border border-line-strong bg-paper-2/90 p-5 shadow-[0_30px_80px_-20px_rgba(16,16,24,0.22)] backdrop-blur-2xl md:bottom-6 md:p-6"
      style={{ boxShadow: `0 0 0 1px ${meta.color}22, 0 30px 80px -20px rgba(16,16,24,0.22)` }}
    >
      <div className="flex items-start gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-line bg-paper">
          <TechIcon name={name} size={28} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">Skill inspector</p>
          <p className="font-display text-2xl text-ink">{name}</p>
          <p className="mt-1 text-sm text-mist">
            {used.length
              ? `Used in ${used.length} project${used.length > 1 ? "s" : ""} below — open one for the full story.`
              : "Part of my everyday toolkit across client and team work."}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-mist transition-colors hover:border-lilac hover:text-ink"
        >
          <LuX />
        </button>
      </div>
      {used.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {used.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/projects/${p.slug}`}
                scroll={false}
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-paper/80 px-4 py-2 text-sm text-ink transition-colors hover:border-lilac"
              >
                <span className="size-1.5 rounded-full" style={{ background: p.accent }} />
                {p.title}
                <LuArrowUpRight className="text-mist transition-transform duration-300 group-hover:rotate-45 group-hover:text-ink" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
