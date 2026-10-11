import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = "Hamza Kahloon — Full Stack Developer & AI/ML Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const photo = readFileSync(join(process.cwd(), "public", profile.headshot.replace(/^\//, "")));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffffff",
          color: "#0e0d14",
          position: "relative",
          padding: 72,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -160,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(16,163,127,0.32), rgba(16,163,127,0) 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -200,
            bottom: -260,
            width: 600,
            height: 600,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(14,165,233,0.24), rgba(14,165,233,0) 65%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, letterSpacing: 6, color: "#55525f" }}>
            <div style={{ width: 14, height: 14, borderRadius: 9999, background: "#34d399" }} />
            AVAILABLE FOR WORK · LAHORE, PK
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1, letterSpacing: -3 }}>Hamza Kahloon</div>
            <div style={{ marginTop: 22, fontSize: 40, color: "#0b7d61" }}>Full Stack Developer · AI/ML Engineer</div>
            <div style={{ marginTop: 18, fontSize: 26, color: "#55525f" }}>Voice AI agents · RAG pipelines · Multi-tenant SaaS</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {["React", "Next.js", "Node.js", "Python", "FastAPI", "LangChain", "OpenAI"].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(14,13,20,0.16)",
                  fontSize: 20,
                  color: "#0e0d14",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            width={300}
            height={300}
            style={{ borderRadius: 40, border: "3px solid rgba(16,163,127,0.55)", objectFit: "cover" }}
          />
        </div>
      </div>
    ),
    size,
  );
}
