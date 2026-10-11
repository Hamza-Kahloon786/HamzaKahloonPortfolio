"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { VOICE_MAX_SECONDS } from "@/lib/assistant/shared";
import { play } from "@/lib/sound";

export type VoiceStatus = "idle" | "connecting" | "live" | "error";
export type Speaker = "user" | "assistant" | null;
export type EndReason = "user" | "limit" | "error";

export type VoiceHandlers = {
  /** A user turn was committed (its transcript arrives later). */
  userTurn: (id: string) => void;
  userText: (id: string, text: string) => void;
  assistantDelta: (id: string, delta: string) => void;
  assistantDone: (id: string, text: string) => void;
  /** Runs a tool the model called; returns a JSON string result. */
  tool: (name: string, args: Record<string, unknown>) => string;
  ended: (reason: EndReason) => void;
};

type Session = {
  pc: RTCPeerConnection;
  dc: RTCDataChannel;
  mic: MediaStream;
  audio: HTMLAudioElement;
  ctx: AudioContext | null;
  raf: number;
  timer: ReturnType<typeof setInterval>;
};

type ServerEvent = {
  type: string;
  item_id?: string;
  delta?: string;
  transcript?: string;
  error?: { message?: string };
  response?: { output?: Array<{ type: string; name?: string; call_id?: string; arguments?: string }> };
};

function waitForIce(pc: RTCPeerConnection, ms: number) {
  if (pc.iceGatheringState === "complete") return Promise.resolve();
  return new Promise<void>((resolve) => {
    const done = () => {
      clearTimeout(t);
      pc.removeEventListener("icegatheringstatechange", check);
      resolve();
    };
    const check = () => pc.iceGatheringState === "complete" && done();
    const t = setTimeout(done, ms);
    pc.addEventListener("icegatheringstatechange", check);
  });
}

function rms(analyser: AnalyserNode, buf: Uint8Array<ArrayBuffer>) {
  analyser.getByteTimeDomainData(buf);
  let sum = 0;
  for (const v of buf) sum += ((v - 128) / 128) ** 2;
  return Math.sqrt(sum / buf.length);
}

/**
 * A speech-to-speech call with the OpenAI Realtime API over WebRTC.
 * The SDP handshake goes through our own /api/assistant/voice route, so no key reaches the browser.
 */
export function useVoiceCall(handlers: VoiceHandlers) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [speaker, setSpeaker] = useState<Speaker>(null);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const level = useRef(0);
  const session = useRef<Session | null>(null);
  const h = useRef(handlers);
  useLayoutEffect(() => {
    h.current = handlers;
  });

  const teardown = useCallback(() => {
    const s = session.current;
    session.current = null;
    if (!s) return;
    cancelAnimationFrame(s.raf);
    clearInterval(s.timer);
    try {
      s.dc.close();
    } catch {}
    s.pc.getSenders().forEach((sender) => sender.track?.stop());
    s.pc.close();
    s.mic.getTracks().forEach((t) => t.stop());
    s.audio.srcObject = null;
    void s.ctx?.close().catch(() => {});
    level.current = 0;
    setSpeaker(null);
  }, []);

  const stop = useCallback(
    (reason: EndReason = "user") => {
      if (!session.current) return;
      play("end");
      teardown();
      setStatus("idle");
      h.current.ended(reason);
    },
    [teardown],
  );

  const send = (event: object) => {
    const dc = session.current?.dc;
    if (dc?.readyState === "open") dc.send(JSON.stringify(event));
  };

  const onEvent = (e: ServerEvent) => {
    switch (e.type) {
      case "input_audio_buffer.speech_started":
        setSpeaker("user");
        break;
      case "input_audio_buffer.speech_stopped":
        setSpeaker(null);
        break;
      case "input_audio_buffer.committed":
        if (e.item_id) h.current.userTurn(e.item_id);
        break;
      case "conversation.item.input_audio_transcription.completed":
        if (e.item_id) h.current.userText(e.item_id, (e.transcript ?? "").trim());
        break;
      case "output_audio_buffer.started":
        setSpeaker("assistant");
        break;
      case "output_audio_buffer.stopped":
      case "output_audio_buffer.cleared":
        setSpeaker((s) => (s === "assistant" ? null : s));
        break;
      case "response.output_audio_transcript.delta":
        if (e.item_id && e.delta) h.current.assistantDelta(e.item_id, e.delta);
        break;
      case "response.output_audio_transcript.done":
        if (e.item_id) h.current.assistantDone(e.item_id, e.transcript ?? "");
        break;
      case "response.done": {
        const calls = (e.response?.output ?? []).filter((o) => o.type === "function_call" && o.call_id);
        if (!calls.length) break;
        for (const call of calls) {
          let args: Record<string, unknown> = {};
          try {
            args = JSON.parse(call.arguments || "{}");
          } catch {}
          send({
            type: "conversation.item.create",
            item: { type: "function_call_output", call_id: call.call_id, output: h.current.tool(call.name ?? "", args) },
          });
        }
        send({ type: "response.create" });
        break;
      }
      case "error":
        console.warn("Voice assistant error:", e.error?.message);
        break;
    }
  };

  const start = useCallback(async () => {
    if (session.current) return;
    // Lets other audio on the page (e.g. the welcome message) step aside.
    window.dispatchEvent(new Event("assistant:voice"));
    setError(null);
    setSeconds(0);
    setStatus("connecting");
    let mic: MediaStream | null = null;
    let pc: RTCPeerConnection | null = null;
    try {
      mic = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      pc = new RTCPeerConnection();
      const audio = new Audio();
      audio.autoplay = true;

      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      const ctx = AC ? new AC() : null;
      const analysers: AnalyserNode[] = [];
      const listen = (stream: MediaStream) => {
        if (!ctx) return;
        const a = ctx.createAnalyser();
        a.fftSize = 256;
        ctx.createMediaStreamSource(stream).connect(a);
        analysers.push(a);
      };

      pc.ontrack = (e) => {
        audio.srcObject = e.streams[0];
        void audio.play().catch(() => {});
        listen(e.streams[0]);
      };
      mic.getAudioTracks().forEach((t) => pc!.addTrack(t, mic!));
      listen(mic);

      const dc = pc.createDataChannel("oai-events");
      dc.addEventListener("message", (m) => {
        try {
          onEvent(JSON.parse(m.data));
        } catch {}
      });
      // The model greets first (its instructions say how).
      dc.addEventListener("open", () => dc.send(JSON.stringify({ type: "response.create" })));
      pc.addEventListener("connectionstatechange", () => {
        if (pc?.connectionState === "failed") {
          setError("The connection dropped. Please try again.");
          stop("error");
        }
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await waitForIce(pc, 1200);

      const res = await fetch("/api/assistant/voice", {
        method: "POST",
        headers: { "Content-Type": "application/sdp" },
        body: pc.localDescription?.sdp ?? offer.sdp,
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "The voice assistant is unavailable right now.");
      }
      await pc.setRemoteDescription({ type: "answer", sdp: await res.text() });

      const buf = new Uint8Array(new ArrayBuffer(128));
      const tick = () => {
        const v = analysers.reduce((m, a) => Math.max(m, rms(a, buf)), 0);
        level.current += (Math.min(1, v * 3.2) - level.current) * 0.35;
        if (session.current) session.current.raf = requestAnimationFrame(tick);
      };
      const timer = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= VOICE_MAX_SECONDS) queueMicrotask(() => stop("limit"));
          return s + 1;
        });
      }, 1000);

      session.current = { pc, dc, mic, audio, ctx, raf: requestAnimationFrame(tick), timer };
      setStatus("live");
      play("start");
    } catch (err) {
      mic?.getTracks().forEach((t) => t.stop());
      pc?.close();
      teardown();
      const name = (err as { name?: string })?.name;
      setError(
        name === "NotAllowedError" || name === "SecurityError"
          ? "Microphone access is blocked. Allow it in your browser, or chat by text below."
          : name === "NotFoundError"
            ? "No microphone was found. You can chat by text below."
            : err instanceof Error
              ? err.message
              : "Couldn't start the call.",
      );
      setStatus("error");
    }
    // onEvent/stop are stable enough for a live session; handlers go through a ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teardown, stop]);

  useEffect(() => teardown, [teardown]);

  return { status, speaker, seconds, error, level, start, stop };
}
