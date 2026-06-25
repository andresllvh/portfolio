"use client";
import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FluidPortrait from "@/components/effects/FluidPortrait";

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-geist-mono, monospace)",
};

export default function HeroIntro() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const photoWrapRef  = useRef<HTMLDivElement>(null);
  const portfolioRef  = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const nameOp  = useTransform(scrollYProgress, [0.05, 0.20], [0, 1]);
  const nameY   = useTransform(scrollYProgress, [0.05, 0.20], [30, 0]);
  const roleOp  = useTransform(scrollYProgress, [0.18, 0.32], [0, 1]);
  const roleY   = useTransform(scrollYProgress, [0.18, 0.32], [30, 0]);
  const photoOp = useTransform(scrollYProgress, [0.40, 0.68], [1, 0]);
  const hintOp  = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  useEffect(() => {
    const el = photoWrapRef.current;
    if (!el) return;
    const set = (v: number) => { el.style.opacity = String(v); };
    set(photoOp.get());
    const unsub = photoOp.on("change", set);
    return () => unsub();
  }, [photoOp]);

  useEffect(() => {
    portfolioRef.current = document.getElementById("portfolio-3d") as HTMLDivElement | null;
    const el = portfolioRef.current;
    if (!el) return;

    el.style.visibility = "hidden";
    el.style.opacity = "0";
    el.style.transition = "opacity 0.6s ease";

    const unsub = scrollYProgress.on("change", (v) => {
      if (!el) return;
      if (v >= 0.70) {
        el.style.visibility = "visible";
        el.style.opacity = "1";
      } else {
        el.style.visibility = "hidden";
        el.style.opacity = "0";
      }
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <section
      id="hero-intro"
      ref={containerRef}
      style={{ position: "relative", height: "160vh" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          isolation: "isolate",
          background: `
            radial-gradient(ellipse 110% 70% at 50% 18%, color-mix(in srgb, var(--aurora-1) 48%, transparent), transparent 62%),
            radial-gradient(ellipse 80% 55% at 50% 95%, color-mix(in srgb, var(--aurora-3) 30%, transparent), transparent 68%),
            linear-gradient(180deg, color-mix(in srgb, var(--aurora-1) 18%, var(--background)) 0%, var(--background) 100%)
          `,
        }}
      >
        {/* retrato fluido — revela máscara ao mover o mouse */}
        <div
          ref={photoWrapRef}
          style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "auto" }}
        >
          <FluidPortrait
            topSrc="/images/andre-real.png"
            bottomSrc="/images/mascara.png"
          />
        </div>

        {/* hint */}
        <motion.div style={{
          opacity: hintOp,
          position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)",
          zIndex: 15, pointerEvents: "none", ...MONO,
          fontSize: 9, letterSpacing: "0.35em",
          color: "var(--ice-300)", textTransform: "uppercase", whiteSpace: "nowrap",
        }}>
          passe o mouse para revelar
        </motion.div>

        {/* textos */}
        <div style={{
          position: "absolute", bottom: "10%", left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", zIndex: 15, padding: "0 calc(64px + 4vw)", pointerEvents: "none",
        }}>
          {/* badge disponível */}
          <motion.div style={{
            opacity: nameOp,
            display: "inline-flex", alignItems: "center", gap: 8,
            marginBottom: 20, padding: "4px 14px", borderRadius: 99,
            background: "color-mix(in srgb, var(--ice-400) 10%, transparent)",
            border: "1px solid color-mix(in srgb, var(--ice-400) 28%, transparent)",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80", flexShrink: 0 }} />
            <span style={{ ...MONO, fontSize: 9, letterSpacing: "0.3em", color: "var(--ice-300)", textTransform: "uppercase" }}>
              aberto a oportunidades
            </span>
          </motion.div>

          {/* nome */}
          <motion.div style={{ opacity: nameOp, y: nameY, marginBottom: 8 }}>
            <h1 style={{ lineHeight: 0.88, letterSpacing: "-0.03em", userSelect: "none" }}>
              <span style={{ display: "block", fontSize: "clamp(3.5rem,8vw,8rem)", fontWeight: 900, color: "var(--foreground)" }}>ANDRÉ</span>
              <span style={{
                display: "block", fontSize: "clamp(3.5rem,8vw,8rem)", fontWeight: 900,
                WebkitTextStroke: "2px var(--ice-400)", color: "transparent",
                textShadow: "0 0 60px color-mix(in srgb, var(--ice-400) 35%, transparent)",
              }}>SANTOS</span>
            </h1>
          </motion.div>

          {/* cargo */}
          <motion.div style={{
            opacity: roleOp, y: roleY,
            display: "flex", alignItems: "center", gap: 12, marginBottom: 22, justifyContent: "center",
          }}>
            <div style={{ width: 32, height: 1, background: "var(--ice-500)" }} />
            <span style={{ ...MONO, fontSize: 11, letterSpacing: "0.3em", color: "var(--ice-400)", textShadow: "0 0 14px color-mix(in srgb, var(--ice-400) 50%, transparent)", textTransform: "uppercase" }}>
              Developer
            </span>
            <div style={{ width: 32, height: 1, background: "var(--ice-500)" }} />
          </motion.div>

        </div>

        {/* scroll hint */}
        <motion.div style={{
          opacity: hintOp,
          position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          pointerEvents: "none", zIndex: 4,
        }}>
          <span style={{ ...MONO, fontSize: 8, letterSpacing: "0.35em", color: "var(--ice-300)", opacity: 0.3, textTransform: "uppercase" }}>scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 1, height: 32, background: "linear-gradient(to bottom, var(--ice-500), transparent)" }}
          />
        </motion.div>

        {/* barra de progresso */}
        <motion.div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          scaleX: scrollYProgress, transformOrigin: "left", zIndex: 4,
          background: "linear-gradient(90deg, var(--ice-600), var(--ice-400), var(--ice-200))",
        }} />
      </div>
    </section>
  );
}
