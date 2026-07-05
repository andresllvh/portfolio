import type React from "react";

/* ─── FluidPortrait — só layout/CSS (shader intocado) ─────────────────── */

/** Largura do frame — a menor entre 92% da viewport e a largura que caberia
 * em 80% da altura da viewport (convertida via a proporção da foto). Isso
 * replica um "object-fit: contain" só com CSS: em telas baixas e largas o
 * limite é a altura; em celulares estreitos o limite é a largura — sem
 * nunca esticar/cortar a foto fora da proporção real (768 x 1377). */
export const PORTRAIT_FRAME_WIDTH =
  "min(92vw, calc(80vh * 768 / 1377))";

/** Altura equivalente (espelha a largura acima pela mesma proporção) —
 * reutilizada pelo HeroIntro para puxar o texto abaixo para perto do fim
 * do degradê (a foto dissolve por completo aos 60% da altura, então ~40%
 * da caixa fica "vazio" por baixo). */
export const PORTRAIT_FRAME_HEIGHT =
  "min(calc(92vw * 1377 / 768), 80vh)";

/** Proporção exata da foto original (768 x 1377) — o frame nunca corta a
 * cabeça e o cover do shader (getCoverUV) fica idêntico a um contain, já
 * que a caixa tem a mesma proporção da imagem. */
export const portraitFrameStyle: React.CSSProperties = {
  position: "relative",
  width: PORTRAIT_FRAME_WIDTH,
  aspectRatio: "768 / 1377",
  margin: "0 auto",
};

/** Brilho ambiente atrás da cabeça — puro CSS (sem duplicar a foto), usa a
 * cor de destaque do tema ativo (--aurora-1), então muda com as 4 estações. */
export const portraitAmbientGlowStyle: React.CSSProperties = {
  position: "absolute",
  inset: "-6%",
  width: "112%",
  height: "112%",
  zIndex: 0,
  pointerEvents: "none",
  background:
    "radial-gradient(ellipse 62% 46% at 50% 26%, color-mix(in srgb, var(--aurora-1) 55%, transparent), transparent 72%)",
};

/** Alias usado pelo FluidPortrait. */
export const portraitBlurBackgroundStyle = portraitAmbientGlowStyle;

/** Degradê do corpo — rosto 100% nítido, dissolve totalmente até 60% da
 * altura (sem retângulo visível no tronco). */
export const portraitCanvasBodyFadeStyle: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to bottom, black 0%, black 40%, rgba(0,0,0,0.5) 50%, transparent 60%)",
  maskImage:
    "linear-gradient(to bottom, black 0%, black 40%, rgba(0,0,0,0.5) 50%, transparent 60%)",
};

