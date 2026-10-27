"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HeroIntro from "@/components/HeroIntro";
import KeyboardSkeleton from "@/components/KeyboardSkeleton";
import SmoothScroll from "@/components/smooth-scroll";
import SectionNav from "@/components/SectionNav";
import ProjectModal from "@/components/ProjectModal";
import SiteHeader from "@/components/sections/SiteHeader";
import HeroSection from "@/components/sections/HeroSection";
import StackSection from "@/components/sections/StackSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";
import { useIsMobile } from "@/lib/useIsMobile";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIdle } from "@/lib/useIdle";
import type { Project } from "@/content/types";

// three.js and the keyboard scene ship in their own chunk, loaded on the
// client only, so they don't block the first render of the hero copy.
const FrozenKeyboard = dynamic(() => import("@/components/FrozenKeyboard"), {
  ssr: false,
  loading: () => <KeyboardSkeleton />,
});

// Composition only: content lives in /content and each section renders its
// own slice of it. This file owns the page-level state (3D keyboard
// visibility and the open project).
export default function Home() {
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const idle = useIdle();

  // Show the fixed 3D keyboard only once the sticky hero-intro photo has
  // fully scrolled past — otherwise it renders on top of the hero photo,
  // since both are position:fixed/sticky full-screen layers.
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("hero-intro");
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
      setShowKeyboard(heroBottom <= 0);
    };
    // Set correct state immediately in case the page is already scrolled
    // (e.g. after a browser back-navigation).
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Phones and "reduce motion" users skip the scroll-driven photo intro
          and land straight on the hero (name, role and CTAs). The CSS class
          hides it before hydration, and the checks keep its WebGL canvas from
          mounting. */}
      <div className="hero-intro-wrap hidden md:block">
        {!isMobile && !reduceMotion && <HeroIntro />}
      </div>
      <div id="portfolio-3d">
        <SmoothScroll>
          <div className="relative">
            {/* Desktop: persistent 3D scene fullscreen behind content. On
                mobile the canvas lives inside the hero instead, so it scrolls
                away and the rest of the page is clean, fast 2D. */}
            {!isMobile && idle && (
              <div
                className="fixed inset-0 z-0 transition-opacity duration-300"
                style={{
                  opacity: showKeyboard ? 1 : 0,
                  pointerEvents: showKeyboard ? "auto" : "none",
                }}
              >
                <FrozenKeyboard interactive={showKeyboard} />
              </div>
            )}

            <SiteHeader />
            <SectionNav />

            <main className="relative z-10 pointer-events-none">
              <HeroSection
                keyboard={
                  isMobile ? (
                    // Mobile-only 3D centerpiece; takes pointer events so
                    // keycaps are tappable.
                    <div className="relative w-full h-[34vh] mt-12 -mb-4 pointer-events-auto">
                      {idle ? <FrozenKeyboard mobile /> : <KeyboardSkeleton />}
                    </div>
                  ) : null
                }
              />
              <StackSection isMobile={isMobile} />
              <ExperienceSection />
              <ProjectsSection onOpen={setActiveProject} />
              <ContactSection />
            </main>

            <ProjectModal
              project={activeProject}
              onClose={() => setActiveProject(null)}
            />
          </div>
        </SmoothScroll>
      </div>
    </>
  );
}
