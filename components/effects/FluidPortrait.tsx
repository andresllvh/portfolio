"use client";

import { useRef, useLayoutEffect, memo } from "react";
import { initPortraitReveal } from "@/lib/fluidPortrait";
import {
  portraitAmbientGlowStyle,
  portraitCanvasBodyFadeStyle,
  portraitFrameStyle,
} from "@/lib/heroPortraitImage";

type FluidPortraitProps = {
  /** Foto normal — visível sem hover */
  topSrc: string;
  /** Foto com máscara — revelada pelo fluido */
  bottomSrc: string;
  alt?: string;
};

export default memo(function FluidPortrait({
  topSrc,
  bottomSrc,
  alt = "André Santos",
}: FluidPortraitProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let destroy: (() => void) | undefined;
    let cancelled = false;

    const start = () => {
      if (cancelled || wrap.clientWidth < 1 || wrap.clientHeight < 1) return;
      try {
        destroy?.();
        destroy = initPortraitReveal({ canvas, topSrc, bottomSrc });
      } catch (err) {
        console.error("[FluidPortrait]", err);
      }
    };

    const ro = new ResizeObserver(() => {
      if (wrap.clientWidth > 0 && wrap.clientHeight > 0 && !destroy) start();
    });
    ro.observe(wrap);
    requestAnimationFrame(start);

    return () => {
      cancelled = true;
      ro.disconnect();
      destroy?.();
    };
  }, [topSrc, bottomSrc]);

  return (
    <div
      ref={wrapRef}
      className="fluid-portrait relative mx-auto"
      style={portraitFrameStyle}
      aria-label={alt}
      role="img"
    >
      {/* Brilho ambiente atrás da cabeça — cor de destaque do tema ativo */}
      <div className="fluid-portrait__blur-stage pointer-events-none absolute inset-0">
        <div aria-hidden style={portraitAmbientGlowStyle} />
      </div>

      {/* Canvas nítido + máscara fluida — inalterado */}
      <div className="fluid-portrait__canvas-stage pointer-events-none absolute inset-0">
        <canvas
          ref={canvasRef}
          className="portrait-canvas absolute inset-0 z-[2] block h-full w-full touch-none"
          style={portraitCanvasBodyFadeStyle}
          aria-hidden
        />
      </div>
    </div>
  );
});
