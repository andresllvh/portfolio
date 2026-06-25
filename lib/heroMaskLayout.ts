/** Layout da camada reveal — portado de hero-mascara.js (Pedro). */
export const BASE_IMAGE_RATIO = 768 / 1377;
export const REVEAL_IMAGE_RATIO = 571 / 1024;

/** Onde o topo do rosto começa na foto base (fração da altura da imagem). */
export const BASE_VISIBLE_TOP_RATIO = 0.02;
/** Onde o topo da máscara começa na imagem reveal. */
export const REVEAL_VISIBLE_TOP_RATIO = 0.04;

export const REVEAL_HEIGHT_RATIO = 0.58;
export const REVEAL_HEIGHT_RATIO_TABLET = 0.58;
export const REVEAL_HEIGHT_RATIO_MOBILE = 0.59;

export type ContainBox = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export function getContainBox(
  containerWidth: number,
  containerHeight: number,
  assetRatio: number,
): ContainBox {
  const containerRatio = containerWidth / Math.max(1, containerHeight);

  if (containerRatio > assetRatio) {
    const height = containerHeight;
    const width = height * assetRatio;
    return {
      width,
      height,
      x: (containerWidth - width) * 0.5,
      y: 0,
    };
  }

  const width = containerWidth;
  const height = width / assetRatio;
  return {
    width,
    height,
    x: 0,
    y: containerHeight - height,
  };
}

export type RevealFrame = {
  width: number;
  height: number;
  left: number;
  top: number;
};

export function getRevealFrame(
  stageWidth: number,
  stageHeight: number,
  revealHeightRatio: number,
  topOffsetRatio = 0,
): RevealFrame {
  const baseBox = getContainBox(stageWidth, stageHeight, BASE_IMAGE_RATIO);
  const height = baseBox.height * revealHeightRatio;
  const width = height * REVEAL_IMAGE_RATIO;
  const left = baseBox.x + (baseBox.width - width) * 0.5;
  const topRatio =
    BASE_VISIBLE_TOP_RATIO -
    REVEAL_VISIBLE_TOP_RATIO * revealHeightRatio +
    topOffsetRatio;
  const top = baseBox.y + baseBox.height * topRatio;

  return { width, height, left, top };
}
