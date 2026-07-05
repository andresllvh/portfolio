"use client";
import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FluidPortrait from "@/components/effects/FluidPortrait";

const PORTRAIT_SRC = "/images/andre-real.png";
const PORTRAIT_MASK_SRC = "/images/mascara.png";

const MONO: React.CSSProperties = {
  fontFamily: "'SF Mono', 'Courier New', monospace",
};

export default function HeroIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const nameOp  = useTransform(scrollYProgress, [0.05, 0.20], [0, 1]);
  const nameY   = useTransform(scrollYProgress, [0.05, 0.20], [30, 0]);
  const roleOp  = useTransform(scrollYProgress, [0.12, 0.28], [0, 1]);
  const roleY   = useTransform(scrollYProgress, [0.12, 0.28], [30, 0]);
  const photoOp = useTransform(scrollYProgress, [0.82, 0.97], [1, 0]);
  const hintOp  = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  useEffect(() => {
    const el = photoWrapRef.current;
    if (!el) return;
    const set = (v: number) => { el.style.opacity = String(v); };
    set(photoOp.get());
    const unsub = photoOp.on("change", set);
    return () => unsub();
  }, [photoOp]);

  return (
    <section
      id="hero-intro"
      ref={containerRef}
      style={{ position: "relative", height: "500vh" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          isolation: "isolate",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "28px 48px 16px",
          background: `
            radial-gradient(ellipse 110% 70% at 50% 18%, rgba(31,72,116,0.48), transparent 62%),
            radial-gradient(ellipse 80% 55% at 50% 95%, rgba(47,98,147,0.30), transparent 68%),
            linear-gradient(180deg, rgba(31,72,116,0.18), #060e1c 100%)
          `,
        }}
      >
        {/* hint */}
        <motion.div
          style={{
            opacity: hintOp,
            flexShrink: 0,
            marginBottom: 16,
            zIndex: 15,
            pointerEvents: "none",
            ...MONO,
            fontSize: 13,
            letterSpacing: "0.35em",
            color: "#a6c5e4",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          passe o mouse para revelar
        </motion.div>

        {/* Retrato fluido — canvas WebGL revela a máscara dev no hover */}
        <div
          style={{
            flexShrink: 1,
            minHeight: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div ref={photoWrapRef} style={{ pointerEvents: "auto" }}>
            <FluidPortrait topSrc={PORTRAIT_SRC} bottomSrc={PORTRAIT_MASK_SRC} />
          </div>
        </div>

        {/* Texto abaixo do retrato — badge, nome, cargo */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            zIndex: 15,
            paddingTop: 18,
            width: "100%",
            pointerEvents: "none",
          }}
        >
          <motion.div
            style={{
              opacity: nameOp,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
              padding: "4px 14px",
              borderRadius: 99,
              background: "rgba(122,166,208,0.10)",
              border: "1px solid rgba(122,166,208,0.28)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80", flexShrink: 0 }} />
            <span style={{ ...MONO, fontSize: 9, letterSpacing: "0.3em", color: "#a6c5e4", textTransform: "uppercase" }}>
              aberto a oportunidades
            </span>
          </motion.div>

          <motion.div style={{ opacity: nameOp, y: nameY, marginBottom: 6 }}>
            <h1 style={{ lineHeight: 0.88, letterSpacing: "-0.03em", userSelect: "none", margin: 0 }}>
              <span style={{ display: "block", fontSize: "clamp(2.4rem, 6.5vw, 6.5rem)", fontWeight: 900, color: "#e9f2fb" }}>
                ANDRÉ
              </span>
              <span style={{
                display: "block", fontSize: "clamp(2.4rem, 6.5vw, 6.5rem)", fontWeight: 900,
                WebkitTextStroke: "2px #7aa6d0", color: "transparent",
                textShadow: "0 0 60px rgba(122,166,208,0.35)",
              }}>
                SANTOS
              </span>
            </h1>
          </motion.div>

          <motion.div style={{ opacity: roleOp, y: roleY, display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
            <div style={{ width: 32, height: 1, background: "#4d85b6" }} />
            <span style={{
              ...MONO, fontSize: 11, letterSpacing: "0.3em",
              color: "#7aa6d0", textShadow: "0 0 14px rgba(122,166,208,0.5)",
              textTransform: "uppercase",
            }}>
              Developer
            </span>
            <div style={{ width: 32, height: 1, background: "#4d85b6" }} />
          </motion.div>
        </div>

        {/* scroll hint */}
        <motion.div
          style={{
            opacity: hintOp,
            position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            pointerEvents: "none", zIndex: 4,
          }}
        >
          <span style={{ ...MONO, fontSize: 8, letterSpacing: "0.35em", color: "#a6c5e4", opacity: 0.3, textTransform: "uppercase" }}>
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 1, height: 32, background: "linear-gradient(to bottom, #4d85b6, transparent)" }}
          />
        </motion.div>

        {/* progress bar */}
        <motion.div
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
            scaleX: scrollYProgress, transformOrigin: "left", zIndex: 4,
            background: "linear-gradient(90deg, #2f6293, #7aa6d0, #cfe0f2)",
          }}
        />
      </div>
    </section>
  );
}