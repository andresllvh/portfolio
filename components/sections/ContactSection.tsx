"use client";

import Reveal from "@/components/Reveal";
import CopyEmail from "@/components/CopyEmail";
import { useLanguage } from "@/components/LanguageProvider";
import { MailIcon } from "@/components/icons";
import { profile } from "@/content/profile";

// Copy pinned to the left so the hero-posed keyboard on the right has room
// to bob its random keys.
export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section
      data-kb-section="contact"
      className="relative py-24 md:min-h-screen flex flex-col justify-center p-6 sm:p-10 md:p-14 overflow-hidden"
    >
      <div className="max-w-xl relative">
        <Reveal>
          <p className="font-mono text-sm text-ice-400 mb-3">
            {t("contact.kicker")}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight text-ice-50 mb-6">
            {t("contact.title")}
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-ice-200 mb-10">{t("contact.body")}</p>
        </Reveal>
        <Reveal delay={240}>
          <div className="flex flex-wrap gap-3 pointer-events-auto">
            <CopyEmail email={profile.email} className="frost-btn frost-btn--primary">
              <MailIcon />
              {t("contact.copyEmail")}
            </CopyEmail>
            <a href={`mailto:${profile.email}`} data-cursor="hover" className="frost-btn">
              {t("contact.openMail")}
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="frost-btn"
            >
              {t("contact.github")}
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="frost-btn"
            >
              {t("contact.linkedin")}
            </a>
          </div>
        </Reveal>
      </div>
      <Reveal delay={320}>
        <p className="mt-14 text-[11px] uppercase tracking-[0.25em] text-ice-400">
          {t("contact.footer")}
        </p>
      </Reveal>
    </section>
  );
}
