"use client";

import { useState, type ReactNode } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import {
  CheckIcon,
  CloudIcon,
  DocumentIcon,
  GitHubIcon,
  LinkedInIcon,
} from "@/components/icons";
import { certifications } from "@/content/certifications";
import { profile } from "@/content/profile";

// Hero name split per word so each can rise independently.
function HeroWord({
  text,
  delay,
  className = "",
}: {
  text: string;
  delay: number;
  className?: string;
}) {
  return (
    <span className={`hero-word ${className}`}>
      <span style={{ animationDelay: `${delay}ms` }}>{text}</span>
    </span>
  );
}

type CvState = "idle" | "opening" | "done";

export default function HeroSection({ keyboard }: { keyboard?: ReactNode }) {
  const { t, lang } = useLanguage();
  const [cvState, setCvState] = useState<CvState>("idle");
  const badge = certifications[0];

  // The PDF opens in a new tab, so the button itself confirms the action:
  // "opening…" for a moment, then a check mark and a short toast.
  const handleCvClick = () => {
    setCvState("opening");
    window.setTimeout(() => setCvState("done"), 600);
    window.setTimeout(() => setCvState("idle"), 2600);
  };

  return (
    <>
      <section
        data-kb-section="hero"
        className="min-h-screen flex flex-col justify-center p-6 sm:p-10 md:p-14"
      >
        {keyboard}
        <div className="mt-2 md:mt-20">
          <p
            className="text-xs uppercase tracking-[0.25em] text-ice-200 mb-5 fade-in-up"
            style={{ ["--d" as string]: "0ms" }}
          >
            {t("hero.greeting")}
          </p>
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] font-bold tracking-[-0.03em] text-ice-50 leading-[0.92] whitespace-nowrap">
            <HeroWord text="André" delay={120} />
            <br />
            <HeroWord text="Santos" delay={260} className="text-ice-400" />
          </h1>
          <p
            className="mt-8 text-base sm:text-lg md:text-xl text-ice-200 max-w-xl leading-relaxed fade-in-up"
            style={{ ["--d" as string]: "520ms" }}
          >
            {t("hero.roleLine")}
            <br />
            {t("hero.tagline")}
          </p>
          <a
            href={badge.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="frost-chip frost-chip--cert mt-5 gap-2 pointer-events-auto fade-in-up"
            style={{ ["--d" as string]: "600ms" }}
          >
            <CloudIcon />
            {badge.name}
          </a>

          {/* CTAs */}
          <div
            className="mt-10 flex flex-wrap items-center gap-3 pointer-events-auto fade-in-up"
            style={{ ["--d" as string]: "700ms" }}
          >
            <a
              href={profile.cv[lang]}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              data-magnetic
              onClick={handleCvClick}
              data-state={cvState}
              className="frost-btn frost-btn--primary cv-btn"
            >
              {cvState === "done" ? <CheckIcon /> : <DocumentIcon />}
              {cvState === "opening" ? t("hero.cvOpening") : t("hero.cv")}
            </a>
            <button
              type="button"
              data-cursor="hover"
              data-magnetic
              className="frost-btn"
              onClick={() =>
                document
                  .querySelector<HTMLElement>('[data-kb-section="contact"]')
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              {t("hero.hire")}
            </button>
            {/* Mobile-only full-width break: forces the social icons onto
                their own row below the two primary buttons. */}
            <div className="basis-full h-0 md:hidden" aria-hidden />
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              data-magnetic
              className="frost-icon"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              data-magnetic
              className="frost-icon"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </a>
          </div>
        </div>

        {/* Animated scroll indicator at bottom */}
        <div
          className="mt-10 md:mt-auto flex items-center gap-3 fade-in-up"
          style={{ ["--d" as string]: "900ms" }}
        >
          <span className="scroll-indicator">
            <span>{t("hero.scroll")}</span>
            <span className="scroll-indicator__rail" />
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-ice-300 hidden sm:inline">
            {t("hero.keysHint")}
          </span>
        </div>
      </section>

      {/* Outside the section: its fade-in transform would otherwise become
          the containing block of this fixed toast. */}
      <div className="toast" data-show={cvState === "done"} role="status" aria-live="polite">
        {t("hero.cvToast")}
      </div>
    </>
  );
}
