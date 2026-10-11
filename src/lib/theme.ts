/**
 * Visitor-selectable color themes. Each theme only swaps the color tokens (see
 * `html[data-theme=…]` in globals.css) — fonts and the white background stay the same.
 */
export const THEMES = [
  { id: "emerald", name: "Emerald", colors: ["#10a37f", "#0ea5e9"] },
  { id: "ocean", name: "Ocean", colors: ["#2b4bff", "#06b6d4"] },
  { id: "violet", name: "Violet", colors: ["#7c3aed", "#06b6d4"] },
  { id: "sunset", name: "Sunset", colors: ["#ea580c", "#f59e0b"] },
  { id: "rose", name: "Rose", colors: ["#e11d48", "#6366f1"] },
  { id: "mono", name: "Mono", colors: ["#171717", "#737373"] },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
export const DEFAULT_THEME: ThemeId = "emerald";
const KEY = "hk-theme";
const EVENT = "theme:change";

/** Inline <head> script: applies the saved theme before first paint (no flash of the default colors). */
export const themeScript = `try{var t=localStorage.getItem('${KEY}');if(t&&/^(${THEMES.filter((t) => t.id !== DEFAULT_THEME)
  .map((t) => t.id)
  .join("|")})$/.test(t))document.documentElement.dataset.theme=t}catch(e){}`;

export const themeStore = {
  subscribe(cb: () => void) {
    window.addEventListener(EVENT, cb);
    return () => window.removeEventListener(EVENT, cb);
  },
  get: (): ThemeId => (document.documentElement.dataset.theme as ThemeId | undefined) ?? DEFAULT_THEME,
  server: (): ThemeId => DEFAULT_THEME,
};

export function applyTheme(id: ThemeId) {
  const root = document.documentElement;
  if (id === DEFAULT_THEME) delete root.dataset.theme;
  else root.dataset.theme = id;
  try {
    localStorage.setItem(KEY, id);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/** Lets canvas-drawn effects re-read the color tokens when the theme changes. */
export const onThemeChange = (cb: () => void) => themeStore.subscribe(cb);
