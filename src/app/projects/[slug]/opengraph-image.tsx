import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getProject, projects } from "@/data/projects";

export const alt = "Project case study by Hamza Kahloon";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug) ?? projects[0];
  const shot = project.image
    ? `data:image/jpeg;base64,${readFileSync(join(process.cwd(), "public", project.image.replace(/^\//, ""))).toString("base64")}`
    : null;
  const a = project.accent;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", color: "#0e0d14", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            right: -100,
            top: -200,
            width: 760,
            height: 760,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${a}55, ${a}00 65%)`,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: shot ? 620 : 1200 }}>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 6, color: a }}>{project.categories.join("  ·  ").toUpperCase()}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: shot ? 76 : 96, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2 }}>{project.title}</div>
            <div style={{ marginTop: 20, fontSize: 32, color: "#3f3c48" }}>{project.tagline}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, color: "#55525f" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${a}`, color: "#0e0d14", fontSize: 18 }}>
              HK
            </div>
            Hamza Kahloon · {project.year}
          </div>
        </div>
        {shot && (
          <div style={{ display: "flex", alignItems: "center", paddingRight: 56 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shot}
              alt=""
              width={520}
              height={325}
              style={{ borderRadius: 18, border: "2px solid rgba(14,13,20,0.12)", objectFit: "cover", objectPosition: "top" }}
            />
          </div>
        )}
      </div>
    ),
    size,
  );
}
