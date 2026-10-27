"use client";

import SeasonPicker from "@/components/SeasonPicker";
import LanguagePicker from "@/components/LanguagePicker";
import { useLanguage } from "@/components/LanguageProvider";
import { GitHubIcon } from "@/components/icons";
import { profile } from "@/content/profile";

export default function SiteHeader() {
  const { t } = useLanguage();

  return (
    <header className="site-header fixed top-0 inset-x-0 z-50 px-6 sm:px-10 md:px-14 py-5 flex items-center justify-between pointer-events-none">
      <div className="site-header__brand flex items-center gap-3 pointer-events-auto transition-all duration-300">
        <span
          data-cursor="hover"
          className="site-header__name text-sm font-semibold tracking-tight text-ice-100 whitespace-nowrap"
        >
          {profile.name}
        </span>
        {/* Wrapper (not the pill itself) carries the hide: .status-pill
            hard-sets display:inline-flex, which beats Tailwind's .hidden
            due to CSS source order, so hiding must happen on a parent. */}
        <span className="hidden md:inline-flex">
          <span className="status-pill">{t("header.availability")}</span>
        </span>
      </div>
      <div className="site-header__actions flex items-center gap-2 pointer-events-auto">
        <SeasonPicker />
        <span className="hidden md:inline-flex">
          <a
            href={profile.repo}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="frost-btn !py-1.5 !px-3 !text-xs"
          >
            <GitHubIcon size={14} />
            <span>GitHub</span>
          </a>
        </span>
        <LanguagePicker />
      </div>
    </header>
  );
}
