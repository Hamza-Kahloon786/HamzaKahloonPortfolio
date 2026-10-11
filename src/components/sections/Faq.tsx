"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuPlus } from "react-icons/lu";
import { faqs } from "@/lib/knowledge";
import { cn, EASE, pad2 } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-32 md:py-40">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div id="faq-title">
              <SectionHeading
                index="06"
                kicker="FAQ"
                size="md"
                parts={["Quick", { text: "answers.", className: "italic text-gradient" }]}
              />
            </div>
            <Reveal delay={0.1} className="mt-8 max-w-sm leading-relaxed text-mist">
              <p>The questions recruiters and clients ask most — answered in one place.</p>
            </Reveal>
          </div>
        </div>

        <ul className="border-t border-line lg:col-span-8">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    className="group flex w-full items-center gap-5 py-6 text-left md:py-7"
                  >
                    <span className="font-mono text-xs text-lilac">{pad2(i + 1)}</span>
                    <span className="flex-1 font-display text-[clamp(1.15rem,2vw,1.6rem)] font-semibold leading-snug text-ink transition-colors group-hover:text-lilac">
                      {f.q}
                    </span>
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-500",
                        isOpen ? "rotate-45 border-ink bg-ink text-paper" : "border-line-strong text-ink group-hover:border-ink",
                      )}
                    >
                      <LuPlus />
                    </span>
                  </button>
                </h3>
                {/* Answers stay in the DOM (hidden when closed) so they are always crawlable. */}
                <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-button-${i}`}>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-7 pl-10 text-base leading-relaxed text-mist md:pl-12 md:text-lg">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!isOpen && <p hidden>{f.a}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
