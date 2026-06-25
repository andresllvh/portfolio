"use client";

import { useRef, useLayoutEffect } from "react";

const LIQUID = {
  stampSpacing: 4.5,
  decay: 0.13,
  decayOutside: 0.34,
  brushRadius: 40,
  ribbonWidth: 50,
  hazeBlur: 12,
  satelliteCount: 2,
  diffuseMix: 0.12,
};

export default function HeroSmoke() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const zone = zoneRef.current;
    if (!canvas || !zone) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      zone.style.display = "none";
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const density = document.createElement("canvas");
    const dCtx = density.getContext("2d", { alpha: true });
    const densityBlur = document.createElement("canvas");
    const dbCtx = densityBlur.getContext("2d", { alpha: true });
    const linesLayer = document.createElement("canvas");
    const lCtx = linesLayer.getContext("2d", { alpha: true });
    const linesStatic = document.createElement("canvas");
    const lsCtx = linesStatic.getContext("2d", { alpha: true });
    if (!dCtx || !dbCtx || !lCtx || !lsCtx) return;

    let linesImg: HTMLImageElement | null = null;
    let linesReady = false;
    let proceduralFrame = 0;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      linesImg = img;
      linesReady = img.naturalWidth > 0 && img.naturalHeight > 0;
      rebuildLinesStatic(0);
    };
    img.src = "/svgs/hero-lines.svg";

    let cssW = 1;
    let cssH = 1;
    let dpr = 1;

    const applySize = (c: HTMLCanvasElement, w: number, h: number, ratio: number) => {
      c.width = Math.max(1, Math.round(w * ratio));
      c.height = Math.max(1, Math.round(h * ratio));
    };

    const drawLinesCover = (targetCtx: CanvasRenderingContext2D, w: number, h: number) => {
      if (!linesReady || !linesImg) return;
      const ir = linesImg.naturalWidth / linesImg.naturalHeight;
      const cr = w / h;
      let dw: number, dh: number, dx: number, dy: number;
      if (cr > ir) {
        dw = w;
        dh = w / ir;
        dx = 0;
        dy = (h - dh) * 0.2;
      } else {
        dh = h;
        dw = h * ir;
        dx = (w - dw) * 0.5;
        dy = 0;
      }
      targetCtx.drawImage(linesImg, dx, dy, dw, dh);
    };

    const drawProceduralLines = (targetCtx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      targetCtx.save();
      targetCtx.strokeStyle = "rgba(122, 166, 208, 0.55)";
      targetCtx.lineWidth = 1.2;
      targetCtx.lineCap = "round";
      const rows = 14;
      for (let i = 0; i < rows; i++) {
        const y = (h / (rows + 1)) * (i + 1) + Math.sin(t * 0.4 + i) * 3;
        targetCtx.beginPath();
        for (let x = -40; x <= w + 40; x += 28) {
          const wave = Math.sin((x + i * 40) * 0.012 + t * 0.25) * 18;
          if (x <= -40) targetCtx.moveTo(x, y + wave);
          else targetCtx.lineTo(x, y + wave);
        }
        targetCtx.stroke();
      }
      targetCtx.restore();
    };

    const rebuildLinesStatic = (t: number) => {
      lsCtx.clearRect(0, 0, cssW, cssH);
      lsCtx.save();
      lsCtx.filter = "brightness(1.4) contrast(1.1) saturate(0.85) hue-rotate(160deg)";
      if (linesReady) drawLinesCover(lsCtx, cssW, cssH);
      else drawProceduralLines(lsCtx, cssW, cssH, t);
      lsCtx.restore();
    };

    const resize = () => {
      const rect = zone.getBoundingClientRect();
      cssW = Math.max(1, Math.round(rect.width));
      cssH = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      applySize(canvas, cssW, cssH, dpr);
      applySize(density, cssW, cssH, dpr);
      applySize(densityBlur, cssW, cssH, dpr);
      applySize(linesLayer, cssW, cssH, dpr);
      applySize(linesStatic, cssW, cssH, dpr);

      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dbCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lsCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuildLinesStatic(0);
    };

    let targetX = -9999;
    let targetY = -9999;
    let px = -9999;
    let py = -9999;
    let ppx = -9999;
    let ppy = -9999;
    let stampX = -9999;
    let stampY = -9999;
    let inside = false;

    const applyPointer = (clientX: number, clientY: number) => {
      const rect = zone.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      inside = x >= -24 && x <= rect.width + 24 && y >= -24 && y <= rect.height + 24;
      targetX = x;
      targetY = y;
    };

    const injectBlob = (x: number, y: number, radius: number, alpha: number) => {
      const g = dCtx.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, `rgba(255,255,255,${alpha})`);
      g.addColorStop(0.22, `rgba(255,255,255,${alpha * 0.78})`);
      g.addColorStop(0.48, `rgba(255,255,255,${alpha * 0.42})`);
      g.addColorStop(0.72, `rgba(255,255,255,${alpha * 0.14})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      dCtx.fillStyle = g;
      dCtx.beginPath();
      dCtx.arc(x, y, radius, 0, Math.PI * 2);
      dCtx.fill();
    };

    const injectAt = (x: number, y: number, speed: number, phase: number) => {
      const r = LIQUID.brushRadius + Math.min(speed * 520, 48);
      injectBlob(x, y, r, 0.92);
      const orbits = [
        [Math.cos(phase) * r * 0.34, Math.sin(phase) * r * 0.28, 0.58],
        [Math.cos(phase + 2.1) * r * 0.42, Math.sin(phase + 1.4) * r * 0.36, 0.44],
      ];
      orbits.slice(0, LIQUID.satelliteCount).forEach(([ox, oy, scale]) => {
        injectBlob(x + ox, y + oy, r * scale, 0.72 * 0.62);
      });
    };

    const stampPath = (x0: number, y0: number, x1: number, y1: number, speed: number, phase: number) => {
      const dist = Math.hypot(x1 - x0, y1 - y1);
      if (dist < 0.01) {
        injectAt(x1, y1, speed, phase);
        return;
      }
      dCtx.save();
      dCtx.lineCap = "round";
      dCtx.lineWidth = LIQUID.ribbonWidth;
      dCtx.strokeStyle = `rgba(255,255,255,${0.72 * 0.55})`;
      dCtx.beginPath();
      dCtx.moveTo(x0, y0);
      dCtx.lineTo(x1, y1);
      dCtx.stroke();
      dCtx.restore();
      const steps = Math.max(1, Math.ceil(dist / LIQUID.stampSpacing));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        injectAt(
          x0 + (x1 - x0) * t + Math.sin(t * 14 + phase) * 1.8,
          y0 + (y1 - y0) * t - Math.sin(t * 14 + phase) * 1.8 * 0.7,
          speed,
          phase + t * 2.4,
        );
      }
    };

    const diffuse = () => {
      dbCtx.clearRect(0, 0, cssW, cssH);
      dbCtx.filter = "blur(5px)";
      dbCtx.drawImage(density, 0, 0, cssW, cssH);
      dbCtx.filter = "none";
      dCtx.globalAlpha = LIQUID.diffuseMix;
      dCtx.drawImage(densityBlur, 0, 0, cssW, cssH);
      dCtx.globalAlpha = 1;
    };

    let visible = true;
    let raf = 0;
    let diffuseFrame = 0;
    const start = performance.now();

    const frame = () => {
      raf = 0;
      if (!visible || document.hidden) return;

      const t = (performance.now() - start) * 0.001;

      dCtx.globalCompositeOperation = "destination-out";
      dCtx.globalAlpha = inside ? LIQUID.decay : LIQUID.decayOutside;
      dCtx.fillStyle = "#000";
      dCtx.fillRect(0, 0, cssW, cssH);
      dCtx.globalAlpha = 1;

      if (inside) {
        if (stampX < -500) {
          stampX = targetX;
          stampY = targetY;
          px = targetX;
          py = targetY;
          ppx = targetX;
          ppy = targetY;
        }
        const phase = t * 4.2;
        const segSpeed = Math.hypot(targetX - stampX, targetY - stampY);
        stampPath(stampX, stampY, targetX, targetY, segSpeed, phase);
        stampX = targetX;
        stampY = targetY;
        ppx = px;
        ppy = py;
        px += (targetX - px) * 0.58;
        py += (targetY - py) * 0.58;
        injectAt(px, py, Math.hypot(px - ppx, py - ppy), phase + 1.7);
      } else {
        stampX = -9999;
        stampY = -9999;
      }

      diffuseFrame += 1;
      if (diffuseFrame % 2 === 0) diffuse();

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "rgba(122, 166, 208, 0.35)";
      ctx.filter = `blur(${LIQUID.hazeBlur}px)`;
      ctx.drawImage(density, 0, 0, cssW, cssH);
      ctx.restore();

      if (!linesReady) {
        proceduralFrame += 1;
        if (proceduralFrame % 2 === 0) rebuildLinesStatic(t);
      }

      lCtx.clearRect(0, 0, cssW, cssH);
      lCtx.drawImage(linesStatic, 0, 0, cssW, cssH);
      lCtx.globalCompositeOperation = "destination-in";
      lCtx.drawImage(density, 0, 0, cssW, cssH);
      lCtx.globalCompositeOperation = "source-over";

      ctx.save();
      ctx.filter = "brightness(1.15) contrast(1.05)";
      ctx.globalAlpha = 0.88;
      ctx.drawImage(linesLayer, 0, 0, cssW, cssH);
      ctx.restore();

      raf = requestAnimationFrame(frame);
    };

    const ensure = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => applyPointer(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) applyPointer(touch.clientX, touch.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
        if (visible) ensure();
        else stop();
      },
      { threshold: 0, rootMargin: "80px 0px" },
    );
    io.observe(zone);

    const onVis = () => (document.hidden ? stop() : ensure());
    document.addEventListener("visibilitychange", onVis);

    const ro = new ResizeObserver(() => resize());
    ro.observe(zone);
    resize();
    ensure();

    return () => {
      stop();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={zoneRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full contain-strict" />
    </div>
  );
}
