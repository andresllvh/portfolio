"use client";

import Reveal from "@/components/Reveal";
import { useLanguage } from "@/components/LanguageProvider";
import { ArrowRightIcon } from "@/components/icons";
import { projects } from "@/content/projects";
import { pick, type Project } from "@/content/types";

// One full-height section per project; alignment alternates so the 3D
// keyboard can sit on the opposite side, next to the big watermark number.
export default function ProjectsSection({
  onOpen,
}: {
  onOpen: (project: Project) => void;
}) {
  const { t, lang } = useLanguage();

  return (
    <>
      {projects.map((p) => {
        const right = p.align === "right";
        return (
          <section
            key={p.num}
            data-kb-section={p.section}
            data-kb-highlights={(p.highlights ?? []).join(",")}
            className="relative py-20 md:min-h-screen flex items-center p-6 sm:p-10 md:p-14 overflow-hidden"
          >
            <span
              aria-hidden
              className={`watermark hidden md:block top-1/2 -translate-y-1/2 ${
                right ? "left-[-2vw]" : "right-[-2vw]"
              }`}
            >
              {p.num}
            </span>

            <div
              className={
                right
                  ? // Extra right padding on md+ keeps the buttons clear of
                    // the fixed SectionNav dots on the right edge.
                    "max-w-xl relative md:ml-auto md:text-right md:mr-16 lg:mr-24"
                  : "max-w-xl relative"
              }
            >
              <Reveal>
                <p className="font-mono text-sm text-ice-400 mb-3">
                  {p.num} · {t("projects.kicker")}
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-ice-50 leading-[1.05] mb-4">
                  {pick(p.name, lang)}
                </h2>
              </Reveal>
              {p.badge ? (
                <Reveal delay={140}>
                  <span className="inline-block text-[10px] uppercase tracking-widest text-ice-300 border border-ice-700 rounded-full px-2 py-0.5 mb-4">
                    {pick(p.badge, lang)}
                  </span>
                </Reveal>
              ) : null}
              <Reveal delay={180}>
                <p className="text-base sm:text-lg text-ice-200 leading-relaxed mb-6">
                  {pick(p.desc, lang)}
                </p>
              </Reveal>
              <Reveal delay={260}>
                <div
                  className={`flex flex-wrap gap-1.5 pointer-events-auto mb-5 ${
                    right ? "md:justify-end" : ""
                  }`}
                >
                  {p.stack.map((s) => (
                    <span key={s} data-cursor="hover" className="frost-chip">
                      {s}
                    </span>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={320}>
                <div
                  className={`flex pointer-events-auto ${
                    right ? "md:justify-end" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onOpen(p)}
                    data-cursor="hover"
                    data-magnetic
                    className="frost-btn"
                  >
                    {t("projects.viewMore")}
                    <ArrowRightIcon />
                  </button>
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}
    </>
  );
}
