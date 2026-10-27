"use client";

import Reveal from "@/components/Reveal";
import { useLanguage } from "@/components/LanguageProvider";
import { certifications } from "@/content/certifications";
import { experiences } from "@/content/experiences";
import { pick } from "@/content/types";

const CARD =
  "relative rounded-2xl bg-ink-1/75 backdrop-blur-md border border-ink-3 p-6 sm:p-8 md:p-10 pointer-events-auto shadow-[0_8px_40px_-20px_rgba(0,0,0,0.6)]";

// The title is sticky at top-24 but sits BEHIND the cards (z-0 vs. the card
// wrapper's z-10), so as you scroll the cards slide over it. The section has
// no filler beyond the cards, so the title un-pins as the last card leaves.
export default function ExperienceSection() {
  const { t, lang } = useLanguage();

  return (
    <section
      data-kb-section="experience"
      className="relative p-6 sm:p-10 md:p-14 pb-24"
    >
      <div className="sticky top-24 sm:top-28 text-center mb-12 sm:mb-16 z-0">
        <Reveal>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-[-0.03em] text-ice-50 leading-[0.95]">
            {t("experience.title")}
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-3 text-sm sm:text-base text-ice-300">
            {t("experience.subtitle")}
          </p>
        </Reveal>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {experiences.map((exp, idx) => (
          <Reveal
            key={`${exp.company}-${idx}`}
            delay={idx * 120}
            as="article"
            className={CARD}
          >
            <header className="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-ice-50 tracking-tight">
                  {pick(exp.role, lang)}
                </h3>
                <p className="text-ice-400 font-medium mt-1">
                  {exp.company}
                  <span className="text-ice-500/80 font-normal">
                    {" · "}
                    {pick(exp.location, lang)}
                  </span>
                </p>
              </div>
              <span className="font-mono text-xs text-ice-100 px-3 py-1 rounded-full border border-ice-700/70 bg-ink-2/60 whitespace-nowrap">
                {pick(exp.period, lang)}
              </span>
            </header>

            <p className="text-ice-200 leading-relaxed mb-5">
              {pick(exp.summary, lang)}
            </p>

            <ul className="space-y-2.5 mb-6">
              {exp.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-ice-100 leading-relaxed">
                  <span className="mt-[0.65em] flex-none w-1.5 h-1.5 rounded-full bg-ice-400" />
                  <span>{pick(b, lang)}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-1.5">
              {exp.stack.map((s) => (
                <span key={s} data-cursor="hover" className="frost-chip">
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        ))}

        <Reveal delay={experiences.length * 120} as="article" className={CARD}>
          <h3 className="text-2xl sm:text-3xl font-bold text-ice-50 tracking-tight mb-5">
            {t("experience.certifications")}
          </h3>
          <ul className="space-y-4">
            {certifications.map((c) => (
              <li
                key={c.name}
                className="flex flex-wrap items-start justify-between gap-3"
              >
                <div>
                  <p className="text-ice-50 font-semibold">{c.name}</p>
                  <p className="text-ice-400 text-sm mt-0.5">
                    {c.issuer}
                    <span className="text-ice-500/80">
                      {" · "}
                      {pick(c.issued, lang)}
                    </span>
                  </p>
                </div>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="frost-chip"
                >
                  {t("experience.credential")}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
