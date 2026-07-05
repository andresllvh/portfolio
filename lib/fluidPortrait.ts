/**
 * Retrato fluido — port fiel de retrato-fluido-interativo-organizado/assets/js/efeito.js
 */
import * as THREE from "three";

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
  varying vec2 vUv;

  void main() {
    vec4 prevState = texture2D(uPrevTrails, vUv);
    float newValue = prevState.r * uDecay;

    if (uIsMoving) {
      vec2 mouseDirection = uMouse - uPrevMouse;
      float lineLength = length(mouseDirection);

      if (lineLength > 0.001) {
        vec2 mouseDir = mouseDirection / lineLength;
        vec2 toPixel = vUv - uPrevMouse;
        float projAlong = dot(toPixel, mouseDir);
        projAlong = clamp(projAlong, 0.0, lineLength);
        vec2 closestPoint = uPrevMouse + projAlong * mouseDir;
        float dist = length(vUv - closestPoint);
        float intensity = smoothstep(0.12, 0.0, dist) * 0.34;
        newValue += intensity;
      }
    }

    gl_FragColor = vec4(newValue, 0.0, 0.0, 1.0);
  }
`;

const displayFragmentShader = `
  uniform sampler2D uFluid;
  uniform sampler2D uTopTexture;
  uniform sampler2D uBottomTexture;
  uniform vec2 uResolution;
  uniform float uDpr;
  uniform vec2 uPointer;
  uniform vec2 uTopTextureSize;
  uniform vec2 uBottomTextureSize;
  varying vec2 vUv;

  vec2 getCoverUV(vec2 uv, vec2 textureSize) {
    if (textureSize.x < 1.0 || textureSize.y < 1.0) return uv;
    vec2 s = uResolution / textureSize;
    float scale = max(s.x, s.y);
    vec2 scaledSize = textureSize * scale;
    vec2 offset = (uResolution - scaledSize) * 0.5;
    return (uv * uResolution - offset) / scaledSize;
  }

  void main() {
    float fluid = texture2D(uFluid, vUv).r;
    float reveal = smoothstep(0.02, 0.02 + 0.004 / uDpr, fluid);

    vec4 topColor = texture2D(uTopTexture, getCoverUV(vUv, uTopTextureSize));
    vec4 bottomColor = texture2D(uBottomTexture, getCoverUV(vUv, uBottomTextureSize));

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
  const dpr = Math.min(window.devicePixelRatio, 2);
  const parent = canvas.parentElement;

  const getW = () =>
    parent && parent.clientWidth > 0
      ? parent.clientWidth
      : window.innerWidth;
  const getH = () =>
    parent && parent.clientHeight > 0
      ? parent.clientHeight
      : window.innerHeight;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    precision: "highp",
    premultipliedAlpha: false,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(Math.max(1, getW()), Math.max(1, getH()));
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  const simScene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const mouse = new THREE.Vector2(0.5, 0.5);
  const prevMouse = new THREE.Vector2(0.5, 0.5);
  const pointer = new THREE.Vector2(0.5, 0.5);
  const smoothPointer = new THREE.Vector2(0.5, 0.5);
  let isMoving = false;
  let lastMoveTime = 0;
  let currentTarget = 0;
  let frameId = 0;

  const pingPong = [
    createFluidRenderTarget(renderer),
    createFluidRenderTarget(renderer),
  ];

  const topTextureSize = new THREE.Vector2(1, 1);
  const bottomTextureSize = new THREE.Vector2(1, 1);

  const trailsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uPrevTrails: { value: null as THREE.Texture | null },
      uMouse: { value: mouse },
      uPrevMouse: { value: prevMouse },
      uDecay: { value: 0.955 },
      uIsMoving: { value: false },
    },
    vertexShader,
    fragmentShader: fluidFragmentShader,
  });

  const displayMaterial = new THREE.ShaderMaterial({
    depthWrite: false,
    uniforms: {
      uFluid: { value: null as THREE.Texture | null },
      uTopTexture: { value: createPlaceholderTexture("#111111") },
      uBottomTexture: { value: createPlaceholderTexture("#333333") },
      uResolution: { value: new THREE.Vector2(getW(), getH()) },
      uDpr: { value: dpr },
      uPointer: { value: smoothPointer },
      uTopTextureSize: { value: topTextureSize },
      uBottomTextureSize: { value: bottomTextureSize },
    },
    vertexShader,
    fragmentShader: displayFragmentShader,
  });

  const loadedTextures: THREE.Texture[] = [];
  loadTexture(topSrc, topTextureSize, (t) => {
    displayMaterial.uniforms.uTopTexture.value = t;
    loadedTextures.push(t);
  });
  loadTexture(bottomSrc, bottomTextureSize, (t) => {
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

  function updatePointer(clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    prevMouse.copy(mouse);
    mouse.x = (clientX - rect.left) / rect.width;
    mouse.y = 1 - (clientY - rect.top) / rect.height;
    pointer.set(mouse.x, mouse.y);
    isMoving = true;
    lastMoveTime = performance.now();
  }

  function onPointerMove(e: PointerEvent) {
    updatePointer(e.clientX, e.clientY);
  }

  function touchInsideCanvas(touch: Touch) {
    const rect = canvas.getBoundingClientRect();
    return (
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom
    );
  }

  // Snaps prevMouse to just beside the tap (not the exact same point — the
  // fluid shader only paints along a mouse→prevMouse segment with nonzero
  // length, so a truly stationary tap would paint nothing at all) and mouse
  // to the tap itself. That tiny offset is well inside the brush radius, so
  // it reads as a dab, not a streak from wherever the pointer last was.
  function resetPointerAt(clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const x = (clientX - rect.left) / rect.width;
    const y = 1 - (clientY - rect.top) / rect.height;
    prevMouse.set(x + 0.015, y + 0.015);
    mouse.set(x, y);
    pointer.set(x, y);
    isMoving = true;
    lastMoveTime = performance.now();
  }

  // Fires immediately on contact — mobile browsers may throttle/suppress
  // touchmove once a gesture is classified as a scroll, so this guarantees a
  // visible reveal at the tap point even if no further touchmove arrives.
  function onTouchStart(e: TouchEvent) {
    if (!e.touches.length) return;
    const touch = e.touches[0];
    if (!touchInsideCanvas(touch)) return;
    resetPointerAt(touch.clientX, touch.clientY);
  }

  // Never calls preventDefault — the page must stay scrollable everywhere,
  // even while a finger is over the portrait. The reveal still tracks the
  // touch position (while it's within the canvas) as the finger passes by;
  // it just no longer fights the browser for the gesture.
  function onTouchMove(e: TouchEvent) {
    if (!e.touches.length) return;
    const touch = e.touches[0];
    if (!touchInsideCanvas(touch)) return;
    updatePointer(touch.clientX, touch.clientY);
  }

  function onResize() {
    const w = Math.max(1, getW());
    const h = Math.max(1, getH());
    renderer.setSize(w, h);
    displayMaterial.uniforms.uResolution.value.set(w, h);
    displayMaterial.uniforms.uDpr.value = Math.min(window.devicePixelRatio, 2);
  }

  function animate() {
    frameId = requestAnimationFrame(animate);
    smoothPointer.lerp(pointer, 0.075);
    if (isMoving && performance.now() - lastMoveTime > 50) isMoving = false;

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
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("resize", onResize);

  const ro = parent ? new ResizeObserver(onResize) : null;
  ro?.observe(parent!);

  onResize();
  animate();

  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("touchstart", onTouchStart);
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
}
