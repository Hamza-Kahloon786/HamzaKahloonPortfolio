"use client";

import { cn } from "@/lib/utils";

/** A surface with a cursor-tracking glow and glowing border (see .spotlight in globals.css). */
export function Spotlight({
  children,
  className,
  as: Comp = "div",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Comp
      {...rest}
      className={cn("spotlight", className)}
      onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </Comp>
  );
}
