"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Pulse = { a: number; b: number; t: number; speed: number; hue: string };

/** "#rrggbb" → "r,g,b" (theme colors are defined as hex custom properties). */
function hexToRgbList(hex: string, fallback: string) {
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

/**
 * Interactive "neural network" background: drifting nodes, distance-based links,
 * signal pulses travelling along edges, and a cursor that lights up nearby neurons.
 */
export function NeuralCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    // Phones keep the static gradient background; the animated network is desktop-only.
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const LINK = 150;
    const MOUSE_R = 210;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    const pulses: Pulse[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let visible = true;
    let armed = false;
    let lastPulse = 0;
    let A = "16,163,127";
    let B = "8,145,178";
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      A = hexToRgbList(cs.getPropertyValue("--color-violet"), A);
      B = hexToRgbList(cs.getPropertyValue("--color-lilac"), B);
    };
    readColors();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(w < 768 ? 36 : 96, Math.max(26, (w * h) / 17000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.3 + 0.5,
      }));
      pulses.length = 0;
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        if (!reduced) {
          if (mouse.active) {
            const dx = mouse.x - n.x;
            const dy = mouse.y - n.y;
            const d = Math.hypot(dx, dy);
            if (d < MOUSE_R && d > 1) {
              const f = (1 - d / MOUSE_R) * 0.012;
              n.vx += (dx / d) * f;
              n.vy += (dy / d) * f;
            }
          }
          const speed = Math.hypot(n.vx, n.vy);
          if (speed > 0.6) {
            n.vx *= 0.96;
            n.vy *= 0.96;
          }
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }

      // Links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const alpha = (1 - Math.sqrt(d2) / LINK) * 0.2;
          ctx.strokeStyle = `rgba(${A},${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Cursor synapses
      if (mouse.active) {
        for (const n of nodes) {
          const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
          if (d > MOUSE_R) continue;
          const alpha = (1 - d / MOUSE_R) * 0.5;
          ctx.strokeStyle = `rgba(${B},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      }

      // Nodes
      for (const n of nodes) {
        const near = mouse.active && Math.hypot(mouse.x - n.x, mouse.y - n.y) < MOUSE_R;
        ctx.fillStyle = near ? `rgba(${B},0.95)` : `rgba(${A},0.45)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, near ? n.r + 0.8 : n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (reduced) return;

      // Spawn signal pulses along short edges
      if (time - lastPulse > 260 && pulses.length < 14) {
        lastPulse = time;
        const i = Math.floor(Math.random() * nodes.length);
        let best = -1;
        let bestD = LINK;
        for (let j = 0; j < nodes.length; j++) {
          if (j === i) continue;
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < bestD && Math.random() > 0.35) {
            best = j;
            bestD = d;
          }
        }
        if (best >= 0) pulses.push({ a: i, b: best, t: 0, speed: 0.012 + Math.random() * 0.012, hue: Math.random() > 0.5 ? A : B });
      }

      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k];
        p.t += p.speed;
        if (p.t >= 1) {
          pulses.splice(k, 1);
          continue;
        }
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
        g.addColorStop(0, `rgba(${p.hue},0.9)`);
        g.addColorStop(1, `rgba(${p.hue},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (!armed) return;
      if (reduced) {
        draw(0);
        return;
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.y >= 0 && mouse.y <= rect.height;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    const onVisibility = () => start();

    resize();
    // Let hydration and the intro finish before the canvas starts competing for the main thread.
    const arm = () => {
      armed = true;
      start();
    };
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idleId = hasIdle ? window.requestIdleCallback(arm, { timeout: 1800 }) : window.setTimeout(arm, 900);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(raf);
    });
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (hasIdle) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={cn("h-full w-full", className)} />;
}
