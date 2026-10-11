"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuArrowLeft, LuArrowRight, LuArrowUpRight, LuBadgeCheck, LuX } from "react-icons/lu";
import { certifications, type Certification } from "@/data/certifications";
import { profile } from "@/data/profile";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { cn, EASE, pad2 } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tilt } from "@/components/ui/Tilt";
import { Portal } from "@/components/ui/Portal";

const PER_PAGE = 6;

export function Certifications() {
  const pages = Math.ceil(certifications.length / PER_PAGE);
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const slice = certifications.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const turn = (d: number) => {
    setDir(d);
    setPage((p) => (p + d + pages) % pages);
  };

  return (
    <section id="certifications" aria-labelledby="certs-title" className="relative overflow-hidden py-32 md:py-44">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_40%,color-mix(in_oklab,var(--color-cyan)_6%,transparent),transparent_55%)]" />
      <div className="container-x relative grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div id="certs-title">
              <SectionHeading
                index="05"
                kicker="Certifications"
                size="md"
                parts={["Learning.", "Building.", { text: "Achieving more.", className: "italic text-gradient" }]}
              />
            </div>
            <Reveal delay={0.1} className="mt-8 max-w-sm leading-relaxed text-mist">
              <p>Every certificate marks a skill I chose to master — and then put to work in production.</p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10 flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.34em] text-mist">
              {["Learn", "Practice", "Build", "Ship", "Repeat"].map((w, i) => (
                <span key={w} className={cn("flex items-center gap-3", i === 3 && "text-ink")}>
                  <span className="h-px w-5 bg-line-strong" />
                  {w}
                </span>
              ))}
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="mb-8 flex items-center justify-between">
            <p className="font-display text-2xl italic text-ink/80 md:text-3xl">Milestones on the way to a bigger me.</p>
            <p className="hidden font-mono text-xs text-mist sm:block">
              {pad2(page * PER_PAGE + 1)} — {pad2(page * PER_PAGE + slice.length)} / {pad2(certifications.length)}
            </p>
          </div>

          <ul className="sr-only">
            {certifications.map((c) => (
              <li key={c.id}>
                {c.title} — {c.issuer}
                {c.year ? `, ${c.year}` : ""}
              </li>
            ))}
          </ul>
          <div className="relative">
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.ul
                key={page}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                {slice.map((c, i) => (
                  <li key={c.id}>
                    <Reveal delay={i * 0.05} y={24}>
                      <CertificateFrame cert={c} onOpen={() => setOpenIndex(page * PER_PAGE + i)} />
                    </Reveal>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-between gap-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim">Select a frame to view</p>
            {pages > 1 && (
              <div className="flex gap-3">
                <PageButton label="Previous certificates" onClick={() => turn(-1)}>
                  <LuArrowLeft />
                </PageButton>
                <PageButton label="Next certificates" onClick={() => turn(1)}>
                  <LuArrowRight />
                </PageButton>
              </div>
            )}
          </div>
        </div>
      </div>

      <Portal>
        <AnimatePresence>
          {openIndex !== null && (
            <CertificateViewer key="viewer" index={openIndex} onIndex={setOpenIndex} onClose={() => setOpenIndex(null)} />
          )}
        </AnimatePresence>
      </Portal>
    </section>
  );
}

function PageButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-12 place-items-center rounded-full border border-line-strong text-ink transition-all hover:border-lilac hover:bg-violet/20"
    >
      {children}
    </button>
  );
}

function CertificateFrame({ cert, onOpen }: { cert: Certification; onOpen: () => void }) {
  return (
    <Tilt className="rounded-2xl" max={10}>
      <button
        type="button"
        onClick={onOpen}
        data-cursor="view"
        data-cursor-label="View"
        className="group relative block w-full rounded-2xl border border-[#c9a96e]/45 bg-white p-3 text-left shadow-[0_20px_50px_-24px_rgba(16,16,24,0.3)] transition-[border-color,box-shadow] duration-500 hover:border-[#b8893a]/70 hover:shadow-[0_24px_60px_-20px_rgba(184,137,58,0.45)]"
      >
        <span aria-hidden className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9a441] shadow-[0_0_14px_4px_rgba(217,164,65,0.45)]" />
        <div className="overflow-hidden rounded-lg">
          <CertificateArt cert={cert} />
        </div>
        <div className="flex items-center justify-between gap-3 px-1 pb-1 pt-3">
          <span className="min-w-0">
            <span className="block truncate font-display text-[15px] text-ink">{cert.title}</span>
            <span className="block truncate text-[11px] text-mist">{cert.issuer}</span>
          </span>
          <LuArrowUpRight className="shrink-0 text-mist transition-transform duration-500 group-hover:rotate-45 group-hover:text-ink" />
        </div>
      </button>
    </Tilt>
  );
}

/** A designed certificate, rendered in CSS (swap in a real scan via `image`). */
function CertificateArt({ cert, large = false }: { cert: Certification; large?: boolean }) {
  if (cert.image) {
    return (
      <div className="relative aspect-[1.414] bg-white">
        <Image src={cert.image} alt={`${cert.title} certificate — ${cert.issuer}`} fill sizes={large ? "900px" : "320px"} className="object-contain" />
      </div>
    );
  }
  return (
    <div
      className="relative aspect-[1.414] overflow-hidden bg-[#fbf8f2] text-[#1b1a17] [container-type:inline-size]"
      role="img"
      aria-label={`${cert.title} certificate issued by ${cert.issuer}${cert.year ? `, ${cert.year}` : ""}`}
    >
      <div className="absolute inset-[3.5cqi] border" style={{ borderColor: `${cert.tone}66` }} />
      <div className="absolute inset-[5cqi] border border-[#1b1a17]/15" />
      <div className="absolute left-0 top-0 h-[22cqi] w-[22cqi]" style={{ background: `linear-gradient(135deg, ${cert.tone}, transparent 70%)`, opacity: 0.55 }} />
      <div className="absolute bottom-0 right-0 h-[16cqi] w-[30cqi]" style={{ background: `linear-gradient(315deg, ${cert.tone}, transparent 70%)`, opacity: 0.45 }} />
      <div className="relative flex h-full flex-col items-center justify-center px-[10cqi] text-center">
        <p className="font-mono text-[2.6cqi] uppercase tracking-[0.3em] text-[#1b1a17]/60">{cert.issuer}</p>
        <p className="mt-[3cqi] font-display text-[3.4cqi] uppercase tracking-[0.35em]">Certificate</p>
        <p className="font-display text-[2.4cqi] italic text-[#1b1a17]/70">of completion</p>
        <p className="mt-[3cqi] font-display text-[6.2cqi] leading-tight">{cert.title}</p>
        <p className="mt-[2.5cqi] text-[2.2cqi] uppercase tracking-[0.25em] text-[#1b1a17]/55">Proudly awarded to</p>
        <p className="mt-[2.4cqi] font-script text-[8cqi] leading-[1]" style={{ color: cert.tone === "#f7df1e" ? "#9a7b00" : cert.tone }}>
          {profile.name}
        </p>
        <div className="mt-[3cqi] flex w-full items-end justify-between text-[2cqi] uppercase tracking-[0.2em] text-[#1b1a17]/55">
          <span className="border-t border-[#1b1a17]/30 pt-[1cqi]">{cert.year ?? "Certified"}</span>
          <span
            className="grid size-[11cqi] place-items-center rounded-full text-[#f6f2ea]"
            style={{ background: `radial-gradient(circle at 35% 30%, ${cert.tone}, #1b1a17 140%)` }}
          >
            <LuBadgeCheck className="size-[5.5cqi]" />
          </span>
          <span className="border-t border-[#1b1a17]/30 pt-[1cqi]">Verified skill</span>
        </div>
      </div>
    </div>
  );
}

function CertificateViewer({ index, onIndex, onClose }: { index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const cert = certifications[index];
  const n = certifications.length;
  const go = useCallback((d: number) => onIndex((index + d + n) % n), [index, n, onIndex]);

  useEffect(() => {
    lockScroll();
    return () => unlockScroll();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] grid place-items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.title} — ${cert.issuer}`}
    >
      <div className="absolute inset-0 bg-paper/85 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ y: 40, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 30, scale: 0.97 }}
        transition={{ duration: 0.6, ease: EASE }}
        data-lenis-prevent
        className="relative grid max-h-[92vh] w-full max-w-5xl gap-8 overflow-y-auto rounded-[28px] border border-line-strong bg-paper-2 p-5 md:grid-cols-[1.5fr_1fr] md:p-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, rotateY: -12 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 12 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="self-center rounded-xl border border-[#c9a96e]/45 bg-white p-3 shadow-[0_30px_70px_-30px_rgba(184,137,58,0.5)]"
          >
            <CertificateArt cert={cert} large />
          </motion.div>
        </AnimatePresence>
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-mist">
              {pad2(index + 1)} / {pad2(n)}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-lilac/50 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink hover:bg-violet/25"
            >
              Close <LuX />
            </button>
          </div>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: cert.tone }}>
            {cert.issuer}
          </p>
          <h3 className="mt-3 font-display text-4xl leading-tight text-ink">{cert.title}</h3>
          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-line py-5 text-sm">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">Issued</dt>
              <dd className="mt-1 text-ink">{cert.year ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">Holder</dt>
              <dd className="mt-1 text-ink">{profile.name}</dd>
            </div>
          </dl>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-dim">Focus areas</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {cert.focus.map((f) => (
              <li key={f} className="rounded-full border border-line px-3 py-1.5 text-xs text-ink/85">
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            {cert.credentialUrl ? (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper"
              >
                Verify credential <LuArrowUpRight />
              </a>
            ) : (
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(`Certificate verification — ${cert.title}`)}`}
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm text-ink transition-colors hover:border-lilac"
              >
                Request a copy <LuArrowUpRight />
              </a>
            )}
            <div className="mt-6 flex gap-3">
              <PageButton label="Previous certificate" onClick={() => go(-1)}>
                <LuArrowLeft />
              </PageButton>
              <PageButton label="Next certificate" onClick={() => go(1)}>
                <LuArrowRight />
              </PageButton>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
