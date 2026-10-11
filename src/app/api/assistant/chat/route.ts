import { CHAT_MAX_CHARS, CHAT_MAX_MESSAGES } from "@/lib/assistant/shared";
import { OPENAI_URL, chatInstructions, clientIp, config, isSameOrigin, jsonError, rateLimit, safetyId } from "@/lib/assistant/server";

type Message = { role: "user" | "assistant"; content: string };

function parseMessages(body: unknown): Message[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const messages = raw.slice(-CHAT_MAX_MESSAGES).map((m) => ({
    role: (m as Message)?.role === "assistant" ? "assistant" : "user",
    content: String((m as Message)?.content ?? "").slice(0, CHAT_MAX_CHARS).trim(),
  })) as Message[];
  if (messages.at(-1)?.role !== "user" || !messages.at(-1)?.content) return null;
  return messages.filter((m) => m.content);
}

/** Text chat with the portfolio assistant. Streams plain-text deltas back to the browser. */
export async function POST(req: Request) {
  if (!config.apiKey) return jsonError(503, "The assistant isn't configured yet.");
  if (!isSameOrigin(req)) return jsonError(403, "Forbidden");

  const ip = clientIp(req);
  const limit = rateLimit(`chat:${ip}`, 25, 10 * 60 * 1000);
  if (!limit.ok) {
    return jsonError(429, "You're sending messages quickly — please wait a moment.", { "Retry-After": String(limit.retryAfter) });
  }

  const messages = parseMessages(await req.json().catch(() => null));
  if (!messages) return jsonError(400, "Please send a message.");

  const upstream = await fetch(`${OPENAI_URL}/responses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Safety-Identifier": safetyId(ip),
    },
    body: JSON.stringify({
      model: config.chatModel,
      instructions: chatInstructions(),
      input: messages,
      stream: true,
      store: false,
      max_output_tokens: 900,
      reasoning: { effort: "low" },
    }),
  }).catch((error) => {
    console.error("Chat request error", error);
    return null;
  });

  if (!upstream?.ok || !upstream.body) {
    if (upstream) console.error("Chat request failed", upstream.status, (await upstream.text()).slice(0, 500));
    return jsonError(502, "The assistant is unavailable right now. Please try again shortly.");
  }

  // Forward only the text deltas from OpenAI's server-sent events.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const event = JSON.parse(data) as { type?: string; delta?: string };
            if (event.type === "response.output_text.delta" && event.delta) controller.enqueue(encoder.encode(event.delta));
          } catch {}
        }
      },
    }),
  );

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
