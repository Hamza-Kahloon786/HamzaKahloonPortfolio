/**
 * Generates the spoken welcome message with OpenAI text-to-speech and saves it as a static
 * file, so visitors hear it without any per-visit API cost.
 *
 *   npm run voice:welcome
 *
 * Reads OPENAI_API_KEY from the environment or .env.local. Edit TEXT / VOICE below and re-run.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "public", "audio", "welcome.mp3");

const TEXT = "Welcome to the portfolio of Muhammad Hamza Tanveer Kahloon — full stack developer and A.I. engineer.";
const VOICE = "marin";
const INSTRUCTIONS =
  "Warm, confident and welcoming, like a polished product-launch announcer. Natural, steady pace with a brief pause after the name. " +
  "Pronounce 'Muhammad' as moo-HAM-mad, 'Tanveer' as tan-VEER and 'Kahloon' as kah-LOON.";

function apiKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  const env = join(root, ".env.local");
  if (!existsSync(env)) return "";
  const line = readFileSync(env, "utf8").split(/\r?\n/).find((l) => /^\s*OPENAI_API_KEY\s*=/.test(l));
  return line ? line.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "") : "";
}

const key = apiKey();
if (!key) {
  console.error("Set OPENAI_API_KEY (in .env.local or the environment) first.");
  process.exit(1);
}

const res = await fetch("https://api.openai.com/v1/audio/speech", {
  method: "POST",
  headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify({ model: "gpt-4o-mini-tts", voice: VOICE, input: TEXT, instructions: INSTRUCTIONS, response_format: "mp3" }),
});
if (!res.ok) {
  console.error("Text-to-speech failed:", res.status, (await res.text()).slice(0, 400));
  process.exit(1);
}

mkdirSync(dirname(OUT), { recursive: true });
const audio = Buffer.from(await res.arrayBuffer());
writeFileSync(OUT, audio);
console.log(`Saved ${OUT} (${(audio.length / 1024).toFixed(1)} KB)`);
