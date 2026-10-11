"use client";

import { motion, type Variants } from "motion/react";
import { createElement, Fragment } from "react";
import { cn, EASE } from "@/lib/utils";

/** Fade-and-rise when scrolled into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 36,
  as = "div",
  amount = 0.25,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article" | "p" | "span";
  amount?: number;
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

const wordVariants: Variants = {
  hidden: { y: "110%", rotate: 4 },
  show: (i: number) => ({
    y: "0%",
    rotate: 0,
    transition: { duration: 1.05, ease: EASE, delay: i },
  }),
};

type Part = string | { text: string; className?: string };

/**
 * Masked word-by-word reveal for headings.
 * `parts` lets you style individual phrases (e.g. an italic accent word).
 * `play` forces the animation (e.g. after the intro); otherwise it triggers in view.
 */
export function SplitText({
  as = "h2",
  parts,
  className,
  delay = 0,
  stagger = 0.06,
  play,
  lineBreaks = false,
}: {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  parts: Part[];
  className?: string;
  delay?: number;
  stagger?: number;
  play?: boolean;
  lineBreaks?: boolean;
}) {
  let index = 0;

  const content = parts.map((part, pi) => {
    const text = typeof part === "string" ? part : part.text;
    const partClass = typeof part === "string" ? undefined : part.className;
    const words = text.split(" ").filter(Boolean);
    return (
      <Fragment key={pi}>
        {words.map((w, wi) => {
          const i = index++;
          return (
            <Fragment key={`${pi}-${wi}`}>
              <span className="-mx-[0.06em] -mb-[0.14em] inline-block overflow-hidden px-[0.06em] pb-[0.14em] align-bottom">
                <motion.span
                  className={cn("inline-block will-change-transform", partClass)}
                  variants={wordVariants}
                  custom={delay + i * stagger}
                >
                  {w}
                </motion.span>
              </span>{" "}
            </Fragment>
          );
        })}
        {lineBreaks && pi < parts.length - 1 ? <br /> : null}
      </Fragment>
    );
  });

  const controlled = play !== undefined;
  return createElement(
    motion[as],
    {
      className,
      initial: "hidden",
      ...(controlled ? { animate: play ? "show" : "hidden" } : { whileInView: "show", viewport: { once: true, amount: 0.4 } }),
    },
    content,
  );
}
