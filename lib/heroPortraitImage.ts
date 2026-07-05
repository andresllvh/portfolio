import type React from "react";

// Proporção exata da foto original (768 x 1377) — usada para o frame do
// retrato nunca cortar a cabeça, independente do tamanho de tela.
export const PORTRAIT_ASPECT_RATIO = 768 / 1377;

export const PORTRAIT_SRC = "/images/andre-real.png";
export const PORTRAIT_MASK_SRC = "/images/mascara.png";

// Frame com a proporção real da foto, centrado, com altura máxima de 700px
// (ou 74% da viewport, o que for menor) — igual ao mockup do Claude Design.
export const portraitFrameStyle: React.CSSProperties = {
  position: "relative",
  height: "min(74vh, 700px)",
  maxHeight: "100%",
  aspectRatio: `${PORTRAIT_ASPECT_RATIO}`,
  maxWidth: "92vw",
  margin: "0 auto",
};

const portraitBlurLayerBase: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
  objectPosition: "center top",
  pointerEvents: "none",
  userSelect: "none",
};

// Camada de brilho/glow desfocado atrás do retrato — dá o efeito de "corpo
// dissolvendo em luz" ao redor do rosto nítido.
export const portraitBodyBlurStyle: React.CSSProperties = {
  ...portraitBlurLayerBase,
  zIndex: 0,
  filter: "blur(50px) brightness(0.76) saturate(0.9)",
  opacity: 0.95,
  WebkitMaskImage: `radial-gradient(
    ellipse 88% 78% at 50% 38%,
    black 0%,
    black 38%,
    rgba(0, 0, 0, 0.5) 58%,
    rgba(0, 0, 0, 0.15) 78%,
    transparent 100%
  )`,
  maskImage: `radial-gradient(
    ellipse 88% 78% at 50% 38%,
    black 0%,
    black 38%,
    rgba(0, 0, 0, 0.5) 58%,
    rgba(0, 0, 0, 0.15) 78%,
    transparent 100%
  )`,
};

// Máscara aplicada sobre a foto nítida (base + reveal do PhotoMask): rosto
// 100% opaco até 40% da altura, dissolve totalmente até 60%. É isso que
// evita o aspecto de "retrato colado" — o corpo funde no fundo antes de
// a foto realmente terminar.
export const portraitCanvasBodyFadeStyle: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 60%)",
  maskImage:
    "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 60%)",
};