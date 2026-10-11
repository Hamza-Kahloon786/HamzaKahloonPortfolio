export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

/** Shared easing — a soft "expo out" used across all motion. */
export const EASE = [0.16, 1, 0.3, 1] as const;

export function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}
