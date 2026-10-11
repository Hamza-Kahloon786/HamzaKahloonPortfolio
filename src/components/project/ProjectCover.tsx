"use client";

import Image from "next/image";
import type { IconType } from "react-icons";
import {
  LuBird, LuBookOpen, LuBot, LuBrainCircuit, LuChartColumn, LuBriefcase, LuDice5, LuEye, LuFileSearch, LuGlobe, LuHeadset, LuLeaf,
  LuMessagesSquare, LuPhone, LuPhoneCall, LuPlane, LuRocket, LuScale, LuSearch, LuShoppingBag, LuStethoscope,
  LuWheat, LuZap,
} from "react-icons/lu";
import type { Project, ProjectGlyph as Glyph } from "@/data/projects";
import { cn } from "@/lib/utils";

const GLYPHS: Record<Glyph, IconType> = {
  "phone-call": LuPhoneCall,
  stethoscope: LuStethoscope,
  zap: LuZap,
  "file-search": LuFileSearch,
  leaf: LuLeaf,
  plane: LuPlane,
  search: LuSearch,
  scale: LuScale,
  "shopping-bag": LuShoppingBag,
  phone: LuPhone,
  messages: LuMessagesSquare,
  dice: LuDice5,
  rocket: LuRocket,
  bot: LuBot,
  globe: LuGlobe,
  eye: LuEye,
  briefcase: LuBriefcase,
  brain: LuBrainCircuit,
  bird: LuBird,
  headset: LuHeadset,
  wheat: LuWheat,
  chart: LuChartColumn,
  book: LuBookOpen,
};

export function ProjectGlyph({ glyph, className, style }: { glyph: Glyph; className?: string; style?: React.CSSProperties }) {
  const Icon = GLYPHS[glyph];
  return <Icon aria-hidden className={className} style={style} />;
}

/** Deterministic pseudo-random sequence from a string (same on server and client). */
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function ProjectCover({
  project,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  preload = false,
  showTitle = true,
}: {
  project: Project;
  className?: string;
  sizes?: string;
  preload?: boolean;
  showTitle?: boolean;
}) {
  if (project.image) {
    return (
      <div className={cn("relative overflow-hidden bg-paper-3", className)}>
        <Image
          src={project.image}
          alt={`${project.title} — ${project.tagline}`}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover object-top"
        />
      </div>
    );
  }

  const rnd = seeded(project.slug);
  const points = Array.from({ length: 9 }, (_, i) => `${(i / 8) * 100},${30 + rnd() * 55}`).join(" ");
  const bars = Array.from({ length: 7 }, () => 25 + rnd() * 70);
  const a = project.accent;

  return (
    <div
      role="img"
      aria-label={`${project.title} — ${project.tagline}`}
      className={cn("relative overflow-hidden [container-type:inline-size]", className)}
      style={{
        background: `radial-gradient(120% 90% at 85% 0%, ${a}38, transparent 55%), radial-gradient(90% 80% at 0% 100%, ${a}1c, transparent 60%), #f8f7fc`,
      }}
    >
      <div className="grid-lines absolute inset-0 opacity-60" />
      {/* faux app UI */}
      <div className="absolute inset-[7%] flex gap-[3%] opacity-90">
        <div className="flex w-[18%] flex-col gap-[6%] rounded-lg border border-ink/10 bg-white/80 p-[3%] shadow-sm">
          <span className="h-[6%] w-[70%] rounded-full" style={{ background: `${a}aa` }} />
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className="h-[4%] rounded-full bg-ink/10" style={{ width: `${55 + ((i * 13) % 35)}%` }} />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-[4%]">
          <div className="flex h-[22%] gap-[3%]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-1 flex-col justify-between rounded-lg border border-ink/10 bg-white/85 p-[4%] shadow-sm">
                <span className="h-[14%] w-1/2 rounded-full bg-ink/12" />
                <span className="h-[26%] w-2/3 rounded-full" style={{ background: i === 0 ? a : "rgba(14,13,20,0.14)" }} />
              </div>
            ))}
          </div>
          <div className="relative flex-1 rounded-lg border border-ink/10 bg-white/80 p-[3%] shadow-sm">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-[6%] h-[88%] w-[88%]">
              <defs>
                <linearGradient id={`fill-${project.slug}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={a} stopOpacity="0.45" />
                  <stop offset="1" stopColor={a} stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={`0,100 ${points} 100,100`} fill={`url(#fill-${project.slug})`} />
              <polyline points={points} fill="none" stroke={a} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div className="flex h-[18%] items-end gap-[2%]">
            {bars.map((b, i) => (
              <span key={i} className="flex-1 rounded-t" style={{ height: `${b}%`, background: i % 3 === 0 ? `${a}cc` : "rgba(14,13,20,0.1)" }} />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-[#f8f7fc] via-[#f8f7fc]/40 to-transparent" />
      <ProjectGlyph
        glyph={project.glyph}
        className="absolute right-[7%] top-[9%] size-[14%] min-h-6 min-w-6"
        style={{ color: a, filter: `drop-shadow(0 6px 14px ${a}66)` }}
      />
      {showTitle && (
        <p className="absolute bottom-[8%] left-[7%] right-[7%] font-display text-[clamp(1rem,7cqi,3rem)] leading-tight text-ink">
          {project.title}
        </p>
      )}
    </div>
  );
}

export function BrowserFrame({ url, children, className }: { url?: string; children: React.ReactNode; className?: string }) {
  const host = url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : undefined;
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-line-strong bg-paper-2 shadow-2xl shadow-black/10", className)}>
      <div className="flex items-center gap-3 border-b border-line bg-paper-3/80 px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="size-2.5 rounded-full bg-[#28c840]/80" />
        </span>
        {host ? (
          <span className="mx-auto truncate rounded-md bg-ink/[0.04] px-3 py-1 font-mono text-[10px] text-mist">{host}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}
