"use client";

import Reveal from "@/components/Reveal";
import MobileSkillsGrid from "@/components/MobileSkillsGrid";
import { useLanguage } from "@/components/LanguageProvider";

// Desktop relies on the 200vh scroll + sticky title while the keyboard does
// the talking on hover. On mobile that choreography is gone, so the section
// renders a compact, tappable skills grid instead.
export default function StackSection({ isMobile }: { isMobile: boolean }) {
  const { t } = useLanguage();

  return (
    <section
      data-kb-section="stack"
      className="relative md:min-h-[200vh] p-6 sm:p-10 md:p-14"
    >
      <div className="relative md:h-[150vh]">
        <div className="md:sticky md:top-28 text-center">
          <Reveal>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-[-0.03em] text-ice-50 leading-[0.95]">
              {t("stack.title")}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-3 text-sm sm:text-base text-ice-400">
              <span className="hidden md:inline">{t("stack.hint")}</span>
              <span className="md:hidden">{t("stack.hintMobile")}</span>
            </p>
          </Reveal>
        </div>

        {isMobile && <MobileSkillsGrid />}
      </div>
    </section>
  );
}
