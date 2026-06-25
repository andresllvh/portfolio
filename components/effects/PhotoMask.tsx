"use client";

import { useRef, useLayoutEffect, useCallback, memo } from "react";
import gsap from "gsap";
import {
  getRevealFrame,
  REVEAL_HEIGHT_RATIO,
  REVEAL_HEIGHT_RATIO_MOBILE,
  REVEAL_HEIGHT_RATIO_TABLET,
} from "@/lib/heroMaskLayout";

interface PhotoMaskProps {
  normalSrc: string;
  spiderSrc: string;
  alt?: string;
}

const SVG_NS = "http://www.w3.org/2000/svg";
const GOO_ID = "andre-blob-goo";
const MASK_ID = "andre-blob-mask";
const BLOB_ROOT_ID = "andre-mask-blobs";

function maskUrl() {
  return `url("#${MASK_ID}")`;
}

function addGradientBlob(
  layers: string[],
  radius: number,
  x: number,
  y: number,
  strength = 0.98,
) {
  layers.push(
    `radial-gradient(circle ${Math.max(8, radius).toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px, #000 ${(strength * 100).toFixed(0)}%, transparent 100%)`,
  );
}

const NUM_AUTO_BLOBS_DESKTOP = 25;
const NUM_AUTO_BLOBS_MOBILE = 10;
const BLOB_MIN = 72;
const BLOB_MAX = 192;
const PARALLAX = 3;
const CURSOR_BLOB_SCALE = 1.12;
const AUTO_BLOB_SCALE = 1.12;
const ORGANIC_OFFSET = 0.16;
const TABLET_PARALLAX = 0.88;
const MOBILE_PARALLAX = 0.72;
const TABLET_BLOB = 0.9;
const MOBILE_BLOB = 0.78;
const TABLET_TOP_OFFSET = 0.006;
const MOBILE_TOP_OFFSET = 0.012;

const baseLayerStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center bottom",
  backgroundSize: "contain",
  userSelect: "none",
  pointerEvents: "none",
};

const revealLayerStyle: React.CSSProperties = {
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center bottom",
  backgroundSize: "contain",
  userSelect: "none",
  pointerEvents: "none",
};

const EDGE_MASK: React.CSSProperties = {
  WebkitMaskImage: [
    "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
    "linear-gradient(to bottom, black 0%, black 36%, transparent 68%)",
  ].join(", "),
  maskImage: [
    "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
    "linear-gradient(to bottom, black 0%, black 36%, transparent 68%)",
  ].join(", "),
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

type AutoBlob = {
  phaseX: number;
  phaseY: number;
  speedX: number;
  speedY: number;
  sat?: SVGCircleElement;
  mainL?: SVGCircleElement;
  mainS?: SVGCircleElement;
};

function spring2D(k: number, d: number) {
  let x = 0, y = 0, vx = 0, vy = 0;
  return {
    reset(px: number, py: number) { x = px; y = py; vx = 0; vy = 0; },
    step(tx: number, ty: number, dt: number) {
      const ax = (tx - x) * k - vx * d;
      const ay = (ty - y) * k - vy * d;
      vx += ax * dt; vy += ay * dt;
      x += vx * dt; y += vy * dt;
      return { x, y };
    },
  };
}

export default memo(function PhotoMask({
  normalSrc,
  spiderSrc,
  alt = "André Santos",
}: PhotoMaskProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  const updatePointer = useCallback((clientX: number, clientY: number) => {
    const stage = stageRef.current;
    if (!stage) return { inside: false };
    const rect = stage.getBoundingClientRect();
    const inside =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom;
    return {
      inside,
      x: clientX - rect.left,
      y: clientY - rect.top,
      ratioTx: inside ? ((clientX - rect.left) / rect.width) * 2 - 1 : 0,
      ratioTy: inside ? ((clientY - rect.top) / rect.height) * 2 - 1 : 0,
      centerX: rect.width * 0.5,
      centerY: rect.height * 0.5,
    };
  }, []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const base = baseRef.current;
    const reveal = revealRef.current;
    const maskEl = document.getElementById(MASK_ID) as SVGMaskElement | null;
    const blobRoot = document.getElementById(BLOB_ROOT_ID) as SVGGElement | null;
    if (!stage || !base || !reveal || !maskEl || !blobRoot) return;

    reveal.classList.remove("is-mask-ready");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      reveal.style.opacity = "0";
      reveal.style.visibility = "hidden";
      return;
    }

    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqTablet = window.matchMedia("(min-width: 768px)");

    const hasSupports = typeof CSS !== "undefined" && typeof CSS.supports === "function";
    const supportsSvg = hasSupports &&
      (CSS.supports("mask-image", `url('#${MASK_ID}')`) ||
        CSS.supports("-webkit-mask-image", `url('#${MASK_ID}')`));
    const supportsGrad = hasSupports &&
      (CSS.supports("mask-image", "radial-gradient(circle at 50% 50%, #000 40%, transparent 41%)") ||
        CSS.supports("-webkit-mask-image", "radial-gradient(circle at 50% 50%, #000 40%, transparent 41%)"));
    // Gradiente é estável no Chrome/Edge; SVG mask com filtro goo falha silenciosamente.
    const maskMode =
      supportsGrad ? "gradient"
      : supportsSvg ? "svg"
      : "clip";

    const setMask = (value: string) => {
      reveal.style.maskImage = value;
      reveal.style.webkitMaskImage = value;
    };

    const applySvgMask = () => {
      const href = maskUrl();
      setMask(href);
      reveal.style.mask = `${href} no-repeat 0 0 / 100% 100%`;
      reveal.style.webkitMask = `${href} no-repeat 0 0 / 100% 100%`;
    };

    reveal.style.maskRepeat = "no-repeat";
    reveal.style.webkitMaskRepeat = "no-repeat";
    reveal.style.maskSize = "100% 100%";
    reveal.style.webkitMaskSize = "100% 100%";
    reveal.style.maskPosition = "0 0";
    reveal.style.webkitMaskPosition = "0 0";

    if (maskMode === "svg") {
      applySvgMask();
    } else {
      setMask("none");
      reveal.style.mask = "none";
      reveal.style.webkitMask = "none";
    }

    let parallaxStrength = PARALLAX;
    let blobSize = 140;
    let wobbleR = blobSize * 0.35;
    let revealHeightRatio = REVEAL_HEIGHT_RATIO;
    let revealTopOffset = 0;
    let ratioTx = 0;
    let ratioTy = 0;
    let mouseTx = 0;
    let mouseTy = 0;
    let isInside = false;
    let lastGradient = "";

    const head = spring2D(250, 30);
    const body1 = spring2D(220, 34);
    const body2 = spring2D(190, 38);
    const ratioSpring = spring2D(300, 40);

    const mkCircle = (parent: SVGGElement, r: number) => {
      const c = document.createElementNS(SVG_NS, "circle");
      c.setAttribute("r", String(r));
      c.setAttribute("fill", "white");
      parent.appendChild(c);
      return c;
    };

    const rSat = () => blobSize * 0.6;
    const rHead = () => blobSize * 0.8;
    const rB1 = () => blobSize * 0.6;
    const rB2 = () => blobSize * 0.45;

    const useSvgMask = maskMode === "svg";
    const cursorG = useSvgMask ? document.createElementNS(SVG_NS, "g") : null;
    const autoG = useSvgMask ? document.createElementNS(SVG_NS, "g") : null;
    if (cursorG) blobRoot.appendChild(cursorG);
    if (autoG) blobRoot.appendChild(autoG);

    const cSat = cursorG ? mkCircle(cursorG, rSat() * CURSOR_BLOB_SCALE) : null;
    const cHead = cursorG ? mkCircle(cursorG, rHead() * CURSOR_BLOB_SCALE) : null;
    const cBody1 = cursorG ? mkCircle(cursorG, rB1() * CURSOR_BLOB_SCALE) : null;
    const cBody2 = cursorG ? mkCircle(cursorG, rB2() * CURSOR_BLOB_SCALE) : null;
    const cTemple = cursorG ? mkCircle(cursorG, rB2() * 0.72 * CURSOR_BLOB_SCALE) : null;
    const cJaw = cursorG ? mkCircle(cursorG, rB2() * 0.58 * CURSOR_BLOB_SCALE) : null;

    const autoState: AutoBlob[] = [];
    const autoCount = mqDesktop.matches ? NUM_AUTO_BLOBS_DESKTOP : NUM_AUTO_BLOBS_MOBILE;
    for (let i = 0; i < autoCount; i++) {
      const entry: AutoBlob = {
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speedX: 0.0005 + Math.random() * 0.0005,
        speedY: 0.0003 + Math.random() * 0.0005,
      };
      if (autoG) {
        entry.sat = mkCircle(autoG, rSat() * AUTO_BLOB_SCALE);
        entry.mainL = mkCircle(autoG, rHead() * AUTO_BLOB_SCALE);
        entry.mainS = mkCircle(autoG, rB2() * AUTO_BLOB_SCALE);
      }
      autoState.push(entry);
    }

    const syncRevealFrame = () => {
      const rect = stage.getBoundingClientRect();
      if (mqDesktop.matches) {
        revealHeightRatio = REVEAL_HEIGHT_RATIO;
        revealTopOffset = 0;
        parallaxStrength = PARALLAX;
      } else if (mqTablet.matches) {
        revealHeightRatio = REVEAL_HEIGHT_RATIO_TABLET;
        revealTopOffset = TABLET_TOP_OFFSET;
        parallaxStrength = PARALLAX * TABLET_PARALLAX;
      } else {
        revealHeightRatio = REVEAL_HEIGHT_RATIO_MOBILE;
        revealTopOffset = MOBILE_TOP_OFFSET;
        parallaxStrength = PARALLAX * MOBILE_PARALLAX;
      }

      const frame = getRevealFrame(rect.width, rect.height, revealHeightRatio, revealTopOffset);
      reveal.style.setProperty("--reveal-width", `${frame.width}px`);
      reveal.style.setProperty("--reveal-height", `${frame.height}px`);
      reveal.style.setProperty("--reveal-left", `${frame.left}px`);
      reveal.style.setProperty("--reveal-top", `${frame.top}px`);
    };

    const syncBlobScale = () => {
      const r = reveal.getBoundingClientRect();
      const ref = Math.max(1, Math.min(r.width, r.height));
      let factor = 1;
      if (!mqDesktop.matches) factor = mqTablet.matches ? TABLET_BLOB : MOBILE_BLOB;
      blobSize = gsap.utils.clamp(BLOB_MIN, BLOB_MAX, ref * 0.22) * factor;
      wobbleR = blobSize * 0.35;

      const setR = (c: SVGCircleElement | null, rad: number) => c?.setAttribute("r", String(rad));
      setR(cSat, rSat() * CURSOR_BLOB_SCALE);
      setR(cHead, rHead() * CURSOR_BLOB_SCALE);
      setR(cBody1, rB1() * CURSOR_BLOB_SCALE);
      setR(cBody2, rB2() * CURSOR_BLOB_SCALE);
      setR(cTemple, rB2() * 0.72 * CURSOR_BLOB_SCALE);
      setR(cJaw, rB2() * 0.58 * CURSOR_BLOB_SCALE);
      autoState.forEach((b) => {
        setR(b.sat ?? null, rSat() * AUTO_BLOB_SCALE);
        setR(b.mainL ?? null, rHead() * AUTO_BLOB_SCALE);
        setR(b.mainS ?? null, rB2() * AUTO_BLOB_SCALE);
      });
    };

    const syncMaskExtents = () => {
      const w = Math.max(1, Math.ceil(reveal.getBoundingClientRect().width));
      const h = Math.max(1, Math.ceil(reveal.getBoundingClientRect().height));
      maskEl.setAttribute("x", "0");
      maskEl.setAttribute("y", "0");
      maskEl.setAttribute("width", String(w));
      maskEl.setAttribute("height", String(h));
    };

    const onResize = () => {
      lastGradient = "";
      syncRevealFrame();
      syncBlobScale();
      syncMaskExtents();
      const rect = stage.getBoundingClientRect();
      mouseTx = rect.width * 0.5;
      mouseTy = rect.height * 0.5;
      head.reset(mouseTx, mouseTy);
      body1.reset(mouseTx, mouseTy);
      body2.reset(mouseTx, mouseTy);
      ratioSpring.reset(0, 0);
    };

    syncRevealFrame();
    syncBlobScale();
    syncMaskExtents();
    onResize();
    reveal.classList.add("is-mask-ready");

    let raf = 0;
    let prev = performance.now();
    let inView = true;

    const tick = (t: number) => {
      const dt = Math.min(0.045, Math.max(1 / 240, (t - prev) / 1000));
      prev = t;
      if (!inView || document.hidden) { raf = 0; return; }

      const cRect = stage.getBoundingClientRect();
      const rRect = reveal.getBoundingClientRect();
      const ox = rRect.left - cRect.left;
      const oy = rRect.top - cRect.top;
      const cw = cRect.width;
      const ch = cRect.height;

      if (!isInside && !mqDesktop.matches) {
        const drift = t * 0.00045;
        ratioTx = Math.sin(drift) * 0.18;
        ratioTy = Math.cos(drift * 1.22) * 0.14;
        mouseTx = cw * (0.5 + Math.sin(drift * 1.35) * 0.12);
        mouseTy = ch * (0.5 + Math.cos(drift * 1.08) * 0.1);
      }

      const rs = ratioSpring.step(ratioTx, ratioTy, dt);
      gsap.set(base, { x: rs.x * parallaxStrength, y: rs.y * parallaxStrength, force3D: true });
      gsap.set(reveal, { x: rs.x * parallaxStrength * 2, y: rs.y * parallaxStrength * 2, force3D: true });

      const headP = head.step(mouseTx, mouseTy, dt);
      const b1 = body1.step(mouseTx, mouseTy, dt);
      const b2 = body2.step(mouseTx, mouseTy, dt);
      const phase = t * 0.002;
      const satX = headP.x + Math.sin(phase) * wobbleR;
      const satY = headP.y + Math.cos(phase) * wobbleR;
      const toLocal = (mx: number, my: number) => ({ x: mx - ox, y: my - oy });

      const showCursor = isInside || !mqDesktop.matches;
      const p0 = toLocal(satX, satY);
      const p1 = toLocal(headP.x, headP.y);
      const p2 = toLocal(b1.x, b1.y);
      const p3 = toLocal(b2.x, b2.y);

      const gradientLayers: string[] = [];

      if (showCursor) {
        if (cursorG) cursorG.setAttribute("opacity", "1");
        const organic = mqDesktop.matches ? 1 : mqTablet.matches ? 0.9 : 0.78;
        const offX = blobSize * ORGANIC_OFFSET * organic;
        const offY = blobSize * ORGANIC_OFFSET * 0.85 * organic;
        const push = (c: SVGCircleElement | null, x: number, y: number) => {
          c?.setAttribute("cx", String(x));
          c?.setAttribute("cy", String(y));
        };
        push(cSat, p0.x, p0.y);
        push(cHead, p1.x, p1.y);
        push(cBody1, p2.x, p2.y);
        push(cBody2, p3.x, p3.y);
        push(cTemple, p1.x + offX, p1.y - offY);
        push(cJaw, p3.x - offX * 0.6, p3.y + offY * 0.9);

        if (maskMode === "gradient") {
          addGradientBlob(gradientLayers, rSat() * CURSOR_BLOB_SCALE, p0.x, p0.y);
          addGradientBlob(gradientLayers, rHead() * CURSOR_BLOB_SCALE, p1.x, p1.y);
          addGradientBlob(gradientLayers, rB1() * CURSOR_BLOB_SCALE, p2.x, p2.y);
          addGradientBlob(gradientLayers, rB2() * CURSOR_BLOB_SCALE, p3.x, p3.y);
          addGradientBlob(gradientLayers, rB2() * 0.72 * CURSOR_BLOB_SCALE, p1.x + offX, p1.y - offY);
          addGradientBlob(gradientLayers, rB2() * 0.58 * CURSOR_BLOB_SCALE, p3.x - offX * 0.6, p3.y + offY * 0.9);
        }
      } else if (cursorG) {
        cursorG.setAttribute("opacity", "0");
      }

      const autoSatR = blobSize * (mqDesktop.matches ? 0.35 : mqTablet.matches ? 0.3 : 0.24);
      autoState.forEach((b) => {
        const mainX = ((Math.sin(t * b.speedX + b.phaseX) + 1) / 2) * cw;
        const mainY = ((Math.cos(t * b.speedY + b.phaseY) + 1) / 2) * ch;
        const sx = mainX + Math.sin(t * 0.002 + b.phaseX) * autoSatR;
        const sy = mainY + Math.cos(t * 0.002 + b.phaseY) * autoSatR;
        const ps = toLocal(sx, sy);
        const pm = toLocal(mainX, mainY);
        if (maskMode === "svg") {
          b.sat?.setAttribute("cx", String(ps.x));
          b.sat?.setAttribute("cy", String(ps.y));
          b.mainL?.setAttribute("cx", String(pm.x));
          b.mainL?.setAttribute("cy", String(pm.y));
          b.mainS?.setAttribute("cx", String(pm.x));
          b.mainS?.setAttribute("cy", String(pm.y));
        } else if (maskMode === "gradient" && gradientLayers.length < 24) {
          addGradientBlob(gradientLayers, rHead() * 0.45, pm.x, pm.y, 0.97);
          addGradientBlob(gradientLayers, rSat() * 0.35, ps.x, ps.y, 0.92);
        }
      });

      if (maskMode === "gradient") {
        const val = gradientLayers.length ? gradientLayers.join(", ") : "radial-gradient(circle 0px at 50% 50%, transparent 100%, transparent 100%)";
        if (val !== lastGradient) {
          lastGradient = val;
          setMask(val);
        }
      } else if (maskMode === "clip") {
        reveal.style.clipPath = `circle(${Math.max(36, blobSize * 0.9).toFixed(1)}px at ${p1.x.toFixed(1)}px ${p1.y.toFixed(1)}px)`;
      }

      raf = requestAnimationFrame(tick);
    };

    const ensure = () => { if (!raf && inView && !document.hidden) raf = requestAnimationFrame(tick); };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

    const applyMove = (clientX: number, clientY: number) => {
      const p = updatePointer(clientX, clientY);
      isInside = p.inside;
      const rect = stage.getBoundingClientRect();
      if (!p.inside) {
        ratioTx = 0;
        ratioTy = 0;
        mouseTx = rect.width * 0.5;
        mouseTy = rect.height * 0.5;
        return;
      }
      mouseTx = p.x!;
      mouseTy = p.y!;
      ratioTx = p.ratioTx!;
      ratioTy = p.ratioTy!;
    };

    const onMove = (e: MouseEvent) => applyMove(e.clientX, e.clientY);
    const onPointerDown = (e: PointerEvent) => { if (e.pointerType !== "mouse") applyMove(e.clientX, e.clientY); };
    const onPointerMove = (e: PointerEvent) => { if (e.pointerType !== "mouse") applyMove(e.clientX, e.clientY); };
    const onPointerUp = () => { isInside = false; ratioTx = 0; ratioTy = 0; };

    window.addEventListener("mousemove", onMove, { passive: true });
    stage.addEventListener("pointerdown", onPointerDown, { passive: true });
    stage.addEventListener("pointermove", onPointerMove, { passive: true });
    stage.addEventListener("pointerup", onPointerUp, { passive: true });
    stage.addEventListener("pointercancel", onPointerUp, { passive: true });

    const ro = new ResizeObserver(onResize);
    ro.observe(stage);
    ro.observe(reveal);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? true;
        if (inView) ensure();
        else stop();
      },
      { threshold: 0, rootMargin: "60px 0px" },
    );
    io.observe(stage);

    const onVis = () => (document.hidden ? stop() : ensure());
    document.addEventListener("visibilitychange", onVis);

    ensure();

    return () => {
      stop();
      window.removeEventListener("mousemove", onMove);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      io.disconnect();
      cursorG?.remove();
      autoG?.remove();
      gsap.set([base, reveal], { clearProps: "transform" });
      reveal.style.removeProperty("mask");
      reveal.style.removeProperty("webkitMask");
      reveal.style.removeProperty("clip-path");
      reveal.classList.remove("is-mask-ready");
    };
  }, [updatePointer]);

  return (
    <div
      ref={stageRef}
      className="relative h-full w-full cursor-pointer overflow-hidden"
      style={{ pointerEvents: "auto" }}
      aria-label={alt}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 overflow-hidden"
        width={0}
        height={0}
      >
        <defs>
          <filter
            id={GOO_ID}
            x="-35%"
            y="-35%"
            width="170%"
            height="170%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
          <mask
            id={MASK_ID}
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="4096"
            height="4096"
          >
            <g filter={`url(#${GOO_ID})`} fill="white">
              <g id={BLOB_ROOT_ID} />
            </g>
          </mask>
        </defs>
      </svg>

      <div
        ref={baseRef}
        className="absolute inset-0 z-[1]"
        style={{
          ...EDGE_MASK,
          ...baseLayerStyle,
          backgroundImage: `url(${normalSrc})`,
        }}
      />

      <div
        ref={revealRef}
        className="photo-mask__reveal pointer-events-none absolute z-[2]"
        style={{
          ...revealLayerStyle,
          backgroundImage: `url(${spiderSrc})`,
          top: "var(--reveal-top, 0)",
          left: "var(--reveal-left, 0)",
          width: "var(--reveal-width, 100%)",
          height: "var(--reveal-height, 100%)",
        }}
      />
    </div>
  );
});
