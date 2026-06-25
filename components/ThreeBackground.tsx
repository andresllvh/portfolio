"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useSeason } from "@/components/SeasonProvider";

function parseHex(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { palette } = useSeason();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 5.2;

    const accent = parseHex(palette.accent);
    const wireColor = accent.clone().lerp(new THREE.Color("#ffffff"), 0.35);

    const torus = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.05, 0.32, 128, 24),
      new THREE.MeshBasicMaterial({
        color: wireColor,
        wireframe: true,
        transparent: true,
        opacity: 0.28,
      }),
    );
    torus.position.set(1.8, 0.4, -1.2);
    scene.add(torus);

    const count = 420;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pointsMat = new THREE.PointsMaterial({
      color: accent,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, pointsMat);
    scene.add(points);

    let w = mount.clientWidth;
    let h = mount.clientHeight;
    let scrollT = 0;
    let projectsOff = false;
    let heroVisible = true;
    let raf = 0;
    let visible = true;

    const resize = () => {
      w = mount.clientWidth;
      h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight || 1;
      scrollT = Math.min(1, Math.max(0, window.scrollY / max));
    };

    const projectSections = Array.from(
      document.querySelectorAll('[data-kb-section="project1"], [data-kb-section="project2"]'),
    );
    const io = new IntersectionObserver(
      (entries) => {
        projectsOff = entries.some((e) => e.isIntersecting);
        mount.classList.toggle("three-off-projects", projectsOff);
      },
      { threshold: 0.12 },
    );
    projectSections.forEach((el) => io.observe(el));

    const hero = document.getElementById("hero-intro");
    const heroIo = hero
      ? new IntersectionObserver(
          ([entry]) => {
            heroVisible = entry?.isIntersecting ?? false;
          },
          { threshold: 0.15 },
        )
      : null;
    if (hero) heroIo?.observe(hero);

    const tick = () => {
      if (!visible || document.hidden || heroVisible) {
        raf = 0;
        return;
      }

      torus.rotation.x += 0.0018;
      torus.rotation.y += 0.0026;
      torus.rotation.z += 0.0012;

      camera.position.z = 5.2 - scrollT * 1.4;
      camera.position.y = scrollT * 0.35;
      pointsMat.opacity = 0.35 + scrollT * 0.35;
      (torus.material as THREE.MeshBasicMaterial).opacity = 0.14 + scrollT * 0.12;

      points.rotation.y += 0.0004;
      points.rotation.x = scrollT * 0.15;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    const visIo = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
        if (visible && !raf) raf = requestAnimationFrame(tick);
        else if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    visIo.observe(mount);

    const onVis = () => {
      if (document.hidden && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!document.hidden && visible && !raf) {
        raf = requestAnimationFrame(tick);
      }
    };

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      heroIo?.disconnect();
      visIo.disconnect();
      geo.dispose();
      pointsMat.dispose();
      torus.geometry.dispose();
      (torus.material as THREE.Material).dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [palette.accent]);

  return (
    <div
      ref={mountRef}
      id="three-bg"
      aria-hidden
      className="three-bg pointer-events-none fixed inset-0"
    />
  );
}
