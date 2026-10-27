import { ImageResponse } from "next/og";

// Preview card shown when the portfolio link is shared (LinkedIn, WhatsApp…).
export const alt = "André Santos — Desenvolvedor Front-End";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          background:
            "radial-gradient(circle at 80% 20%, #1f4874 0%, #0b1a33 45%, #060e1c 100%)",
          color: "#e8f1fb",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#9fc3e6",
          }}
        >
          Portfólio
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 112,
            fontWeight: 700,
            lineHeight: 1,
            marginTop: 24,
          }}
        >
          André&nbsp;<span style={{ color: "#7fb0e0" }}>Santos</span>
        </div>
        <div style={{ fontSize: 44, marginTop: 32, color: "#cfe0f2" }}>
          Desenvolvedor Front-End Jr
        </div>
        <div style={{ fontSize: 32, marginTop: 16, color: "#9fc3e6" }}>
          React · Next.js · TypeScript · JavaScript · Node.js
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            padding: "12px 28px",
            borderRadius: 999,
            border: "2px solid rgba(166, 197, 228, 0.45)",
            fontSize: 28,
            color: "#e8f1fb",
            alignSelf: "flex-start",
          }}
        >
          AWS Certified Cloud Practitioner
        </div>
      </div>
    ),
    size
  );
}
