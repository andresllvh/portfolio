"use client";

import { useRef, useLayoutEffect } from "react";

/** Linhas de fundo em todo o site — parallax suave no mouse. */
export default function SiteLines() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const needsTick = () =>
      !document.hidden &&
      (Math.abs(targetX - currentX) > 0.0008 ||
        Math.abs(targetY - currentY) > 0.0008 ||
        targetX !== 0 ||
        targetY !== 0);

    const tick = () => {
      raf = 0;
      if (document.hidden) return;

      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;
      root.style.setProperty("--hero-line-shift-x", `${(currentX * 11).toFixed(2)}px`);
      root.style.setProperty("--hero-line-shift-y", `${(currentY * 7).toFixed(2)}px`);
      root.style.setProperty("--hero-line-ghost-x", `${(-currentX * 18).toFixed(2)}px`);
      root.style.setProperty("--hero-line-ghost-y", `${(-currentY * 12).toFixed(2)}px`);

      if (needsTick()) raf = requestAnimationFrame(tick);
    };

    const ensureTick = () => {
      if (!raf && needsTick()) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      targetX = ((e.clientX / window.innerWidth) - 0.5) * 2;
      targetY = ((e.clientY / window.innerHeight) - 0.5) * 2;
      ensureTick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    ensureTick();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="site-lines pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      style={
        {
          "--hero-line-shift-x": "0px",
          "--hero-line-shift-y": "0px",
          "--hero-line-ghost-x": "0px",
          "--hero-line-ghost-y": "0px",
        } as React.CSSProperties
      }
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 85% at 50% 48%, color-mix(in srgb, var(--ice-400) 10%, transparent) 0%, transparent 68%),
            radial-gradient(ellipse 55% 45% at 18% 78%, var(--aurora-3) 0%, transparent 72%),
            radial-gradient(ellipse 50% 40% at 82% 22%, var(--aurora-1) 0%, transparent 68%)
          `,
        }}
      />
      <div className="absolute inset-[-10%_-6%] animate-[hero-lines-drift_28s_ease-in-out_infinite]">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat will-change-transform"
          style={{
            backgroundImage: "url(/svgs/hero-lines.svg)",
            backgroundPosition: "center 50%",
            opacity: 0.42,
            filter: "brightness(1.6) contrast(0.9) saturate(0.7) hue-rotate(180deg)",
            transform:
              "translate3d(var(--hero-line-shift-x), var(--hero-line-shift-y), 0)",
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-no-repeat will-change-transform mix-blend-screen"
          style={{
            backgroundImage: "url(/svgs/hero-lines-ghost.svg)",
            backgroundPosition: "center 38%",
            opacity: 0.28,
            filter: "brightness(1.4) hue-rotate(160deg)",
            transform:
              "translate3d(var(--hero-line-ghost-x), var(--hero-line-ghost-y), 0) scale(1.035)",
          }}
        />
      </div>
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />
    </div>
  );
}
