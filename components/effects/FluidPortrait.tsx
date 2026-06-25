"use client";

import { useRef, useLayoutEffect, memo, useState } from "react";
import { initPortraitReveal } from "@/lib/fluidPortrait";

type FluidPortraitProps = {
  topSrc: string;
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
  const [webglOk, setWebglOk] = useState(false);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    setWebglOk(false);
    let destroy: (() => void) | undefined;
    let cancelled = false;

    const start = () => {
      if (cancelled || wrap.clientWidth < 1 || wrap.clientHeight < 1) return;
      try {
        destroy?.();
        destroy = initPortraitReveal({ canvas, topSrc, bottomSrc });
        setWebglOk(true);
      } catch (err) {
        console.error("[FluidPortrait]", err);
        setWebglOk(false);
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
      setWebglOk(false);
    };
  }, [topSrc, bottomSrc]);

  return (
    <div
      ref={wrapRef}
      className="fluid-portrait relative h-full w-full overflow-hidden"
      aria-label={alt}
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={topSrc}
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain object-bottom pointer-events-none transition-opacity duration-300"
        style={{ opacity: webglOk ? 0 : 1 }}
        draggable={false}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full touch-none"
        aria-hidden={webglOk}
      />
    </div>
  );
});
