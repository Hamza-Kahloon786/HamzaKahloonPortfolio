import {
  OPENAI_URL,
  clientIp,
  config,
  isSameOrigin,
  jsonError,
  rateLimit,
  safetyId,
  voiceInstructions,
  voiceTools,
} from "@/lib/assistant/server";

/**
 * Starts a voice session with the OpenAI Realtime API using the unified WebRTC interface:
 * the browser posts its SDP offer here, we attach the session config and our API key
 * server-side, and return OpenAI's SDP answer. The key never reaches the browser.
 */
export async function POST(req: Request) {
  if (!config.apiKey) return jsonError(503, "The voice assistant isn't configured yet.");
  if (!isSameOrigin(req)) return jsonError(403, "Forbidden");

  const ip = clientIp(req);
  const limit = rateLimit(`voice:${ip}`, 4, 60 * 60 * 1000);
  if (!limit.ok) {
    return jsonError(429, "You've reached the voice limit for now — you can keep chatting by text.", {
      "Retry-After": String(limit.retryAfter),
    });
  }

  const sdp = await req.text();
  if (!sdp.startsWith("v=") || sdp.length > 20_000) return jsonError(400, "Invalid connection offer.");

  const session = {
    type: "realtime",
    model: config.realtimeModel,
    instructions: voiceInstructions(),
    output_modalities: ["audio"],
    audio: {
      input: {
        transcription: { model: config.transcribeModel },
        turn_detection: { type: "semantic_vad" },
      },
      output: { voice: config.voice },
    },
    tools: voiceTools,
    tool_choice: "auto",
    max_output_tokens: 800,
    ...(config.realtimeModel.startsWith("gpt-realtime-2") ? { reasoning: { effort: "low" } } : {}),
  };

  const form = new FormData();
  form.set("sdp", sdp);
  form.set("session", JSON.stringify(session));

  try {
    const res = await fetch(`${OPENAI_URL}/realtime/calls`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "OpenAI-Safety-Identifier": safetyId(ip),
      },
      body: form,
    });
    if (!res.ok) {
      console.error("Realtime session failed", res.status, (await res.text()).slice(0, 500));
      return jsonError(502, "The voice assistant is unavailable right now. Please try text chat.");
    }
    return new Response(await res.text(), {
      status: 201,
      headers: { "Content-Type": "application/sdp", "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Realtime session error", error);
    return jsonError(502, "The voice assistant is unavailable right now. Please try text chat.");
  }
}
