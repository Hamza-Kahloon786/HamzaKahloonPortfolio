/** Shared between the assistant's server routes and the browser widget. */

export const ASSISTANT_SECTIONS = ["about", "skills", "experience", "projects", "certifications", "faq", "contact"] as const;
export type AssistantSection = (typeof ASSISTANT_SECTIONS)[number];

/** Longest voice call, in seconds, before the widget hangs up and offers text chat. */
export const VOICE_MAX_SECONDS = 180;

export const CHAT_MAX_MESSAGES = 12;
export const CHAT_MAX_CHARS = 800;

/** Splits assistant text into plain text and [[project:slug]] / [[section:id]] link markers. */
export function parseMarkers(text: string) {
  const parts: Array<{ type: "text"; value: string } | { type: "project" | "section"; value: string }> = [];
  const re = /\[\[(project|section):([a-z0-9-]+)\]\]/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) parts.push({ type: "text", value: text.slice(last, m.index) });
    parts.push({ type: m[1] as "project" | "section", value: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
  return parts;
}
