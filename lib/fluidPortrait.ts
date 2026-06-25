/**
 * Retrato fluido interativo — fiel ao efeito.js (Império WEB Codes Store).
 */
import * as THREE from "three";
import { BASE_IMAGE_RATIO, getContainBox } from "@/lib/heroMaskLayout";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fluidFragmentShader = `
  uniform sampler2D uPrevTrails;
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform float uDecay;
  uniform bool uIsMoving;
  uniform float uHeadMinY;
  varying vec2 vUv;

  float stamp(vec2 center, float radius, float strength) {
    return smoothstep(radius, 0.0, length(vUv - center)) * strength;
  }

  void main() {
    vec4 prevState = texture2D(uPrevTrails, vUv);
    float newValue = prevState.r * uDecay;

    if (uIsMoving && uMouse.y >= uHeadMinY) {
      vec2 mouseDirection = uMouse - uPrevMouse;
      float lineLength = length(mouseDirection);

      if (lineLength > 0.001) {
        vec2 mouseDir = mouseDirection / lineLength;
        vec2 toPixel = vUv - uPrevMouse;
        float projAlong = dot(toPixel, mouseDir);
        projAlong = clamp(projAlong, 0.0, lineLength);
        vec2 closestPoint = uPrevMouse + projAlong * mouseDir;
        if (closestPoint.y >= uHeadMinY) {
          newValue += stamp(closestPoint, 0.105, 0.34);
        }
      }

      if (uMouse.y >= uHeadMinY) {
        newValue += stamp(uMouse, 0.09, 0.28);
      }
    }

    gl_FragColor = vec4(clamp(newValue, 0.0, 1.0), 0.0, 0.0, 1.0);
  }
`;

const displayFragmentShader = `
  uniform sampler2D uFluid;
  uniform sampler2D uTopTexture;
  uniform sampler2D uBottomTexture;
  uniform vec2 uResolution;
  uniform float uDpr;
  uniform vec2 uTopTextureSize;
  varying vec2 vUv;

  vec2 getContainBottomUV(vec2 uv, vec2 textureSize) {
    if (textureSize.x < 1.0 || textureSize.y < 1.0) return uv;
    vec2 s = uResolution / textureSize;
    float scale = min(s.x, s.y);
    vec2 scaledSize = textureSize * scale;
    vec2 offset = vec2((uResolution.x - scaledSize.x) * 0.5, uResolution.y - scaledSize.y);
    return (uv * uResolution - offset) / scaledSize;
  }

  void main() {
    float fluid = texture2D(uFluid, vUv).r;
    float reveal = smoothstep(0.02, 0.02 + 0.004 / uDpr, fluid);

    vec2 imageUV = getContainBottomUV(vUv, uTopTextureSize);

    vec4 topColor    = texture2D(uTopTexture,    imageUV);
    vec4 bottomColor = texture2D(uBottomTexture, imageUV);

    vec4 imageColor = mix(topColor, bottomColor, reveal);
    imageColor.rgb = pow(imageColor.rgb, vec3(0.95));
    imageColor.rgb = min(imageColor.rgb * 1.02 + 0.005, vec3(1.0));

    gl_FragColor = imageColor;
  }
`;

export type PortraitRevealOptions = {
  canvas: HTMLCanvasElement;
  topSrc: string;
  bottomSrc: string;
};

function createPlaceholderTexture(hexColor: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.fillStyle = hexColor;
    ctx.fillRect(0, 0, 512, 512);
  }
  const t = new THREE.CanvasTexture(c);
  t.minFilter = THREE.LinearFilter;
  return t;
}

function loadTexture(
  url: string,
  sizeVec: THREE.Vector2,
  callback: (t: THREE.Texture) => void,
) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    sizeVec.set(img.width, img.height);
    const t = new THREE.Texture(img);
    t.needsUpdate = true;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    callback(t);
  };
  img.onerror = () => {
    console.error("[FluidPortrait] Falha ao carregar:", url);
  };
  img.src = url;
}

function createFluidRenderTarget(
  renderer: THREE.WebGLRenderer,
): THREE.WebGLRenderTarget {
  const types = [THREE.FloatType, THREE.HalfFloatType, THREE.UnsignedByteType];
  for (const type of types) {
    let rt: THREE.WebGLRenderTarget | null = null;
    try {
      rt = new THREE.WebGLRenderTarget(600, 600, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type,
      });
      renderer.setRenderTarget(rt);
      renderer.clear();
      renderer.setRenderTarget(null);
      return rt;
    } catch {
      rt?.dispose();
    }
  }
  throw new Error("[FluidPortrait] Nenhum formato de render target suportado.");
}

export function initPortraitReveal({
  canvas,
  topSrc,
  bottomSrc,
}: PortraitRevealOptions): () => void {
  const parent = canvas.parentElement;
  const getW = () => (parent ? parent.clientWidth : window.innerWidth);
  const getH = () => (parent ? parent.clientHeight : window.innerHeight);

  const dpr = Math.min(window.devicePixelRatio, 2);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    precision: "highp",
    premultipliedAlpha: false,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(Math.max(1, getW()), Math.max(1, getH()));
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  const simScene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const mouse = new THREE.Vector2(0.5, 0.5);
  const prevMouse = new THREE.Vector2(0.5, 0.5);
  let isMoving = false;
  let lastMoveTime = 0;
  let currentTarget = 0;
  let frameId = 0;

  const pingPong = [createFluidRenderTarget(renderer), createFluidRenderTarget(renderer)];

  const topTextureSize = new THREE.Vector2(1, 1);
  let headMinY = 0.35;

  const trailsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uPrevTrails: { value: null as THREE.Texture | null },
      uMouse: { value: mouse },
      uPrevMouse: { value: prevMouse },
      uDecay: { value: 0.97 },
      uIsMoving: { value: false },
      uHeadMinY: { value: headMinY },
    },
    vertexShader,
    fragmentShader: fluidFragmentShader,
  });

  const displayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uFluid: { value: null as THREE.Texture | null },
      uTopTexture: { value: createPlaceholderTexture("#111111") },
      uBottomTexture: { value: createPlaceholderTexture("#333333") },
      uResolution: { value: new THREE.Vector2(getW(), getH()) },
      uDpr: { value: dpr },
      uTopTextureSize: { value: topTextureSize },
    },
    vertexShader,
    fragmentShader: displayFragmentShader,
  });

  const loadedTextures: THREE.Texture[] = [];
  loadTexture(topSrc, topTextureSize, (t) => {
    displayMaterial.uniforms.uTopTexture.value = t;
    loadedTextures.push(t);
  });
  loadTexture(bottomSrc, topTextureSize, (t) => {
    displayMaterial.uniforms.uBottomTexture.value = t;
    loadedTextures.push(t);
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  scene.add(new THREE.Mesh(geometry, displayMaterial));
  simScene.add(new THREE.Mesh(geometry, trailsMaterial));

  renderer.setRenderTarget(pingPong[0]);
  renderer.clear();
  renderer.setRenderTarget(pingPong[1]);
  renderer.clear();
  renderer.setRenderTarget(null);

  function syncHeadZone() {
    const w = Math.max(1, getW());
    const h = Math.max(1, getH());
    const box = getContainBox(w, h, BASE_IMAGE_RATIO);
    const photoBottom = (h - box.y - box.height) / h;
    const photoTop = (h - box.y) / h;
    headMinY = photoBottom + (photoTop - photoBottom) * 0.36;

    trailsMaterial.uniforms.uHeadMinY.value = headMinY;
  }

  function updatePointer(clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    prevMouse.copy(mouse);
    mouse.x = (clientX - rect.left) / rect.width;
    mouse.y = 1 - (clientY - rect.top) / rect.height;
    isMoving = mouse.y >= headMinY;
    if (isMoving) lastMoveTime = performance.now();
  }

  function onPointerMove(e: PointerEvent) {
    updatePointer(e.clientX, e.clientY);
  }

  function onTouchMove(e: TouchEvent) {
    if (!e.touches.length) return;
    e.preventDefault();
    updatePointer(e.touches[0].clientX, e.touches[0].clientY);
  }

  function onResize() {
    const w = Math.max(1, getW());
    const h = Math.max(1, getH());
    renderer.setSize(w, h);
    displayMaterial.uniforms.uResolution.value.set(w, h);
    displayMaterial.uniforms.uDpr.value = Math.min(window.devicePixelRatio, 2);
    syncHeadZone();
  }

  function animate() {
    frameId = requestAnimationFrame(animate);

    if (isMoving && performance.now() - lastMoveTime > 80) isMoving = false;

    const prev = pingPong[currentTarget];
    currentTarget = (currentTarget + 1) % 2;
    const cur = pingPong[currentTarget];

    trailsMaterial.uniforms.uPrevTrails.value = prev.texture;
    trailsMaterial.uniforms.uMouse.value.copy(mouse);
    trailsMaterial.uniforms.uPrevMouse.value.copy(prevMouse);
    trailsMaterial.uniforms.uIsMoving.value = isMoving;

    renderer.setRenderTarget(cur);
    renderer.render(simScene, camera);

    displayMaterial.uniforms.uFluid.value = cur.texture;
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("resize", onResize);

  const ro = parent ? new ResizeObserver(onResize) : null;
  if (parent) ro?.observe(parent);

  onResize();
  requestAnimationFrame(onResize);
  animate();

  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("resize", onResize);
    ro?.disconnect();
    geometry.dispose();
    trailsMaterial.dispose();
    displayMaterial.dispose();
    pingPong.forEach((rt) => rt.dispose());
    loadedTextures.forEach((t) => t.dispose());
    renderer.dispose();
  };
};
