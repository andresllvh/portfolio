"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { SKILLS_FLAT } from "@/lib/skills";

// Phone version of the stack: a compact 3-column grid (about one screen
// instead of three). Tapping a skill shows its tagline below the grid, which
// replaces the hover tooltip the 3D keyboard uses on desktop.
export default function MobileSkillsGrid() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const skill = SKILLS_FLAT.find((s) => s.slug === selected);

  return (
    <div className="md:hidden mt-10 pointer-events-auto">
      <ul className="grid grid-cols-3 gap-2">
        {SKILLS_FLAT.map((s) => {
          const active = s.slug === selected;
          return (
            <li key={s.slug}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(active ? null : s.slug)}
                className={`skill-tile w-full flex flex-col items-center gap-2 rounded-xl border px-2 py-3 ${
                  active
                    ? "bg-ink-2/80 border-ice-400/70"
                    : "bg-ink-1/70 border-ink-3"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill={`#${s.hex}`}
                  aria-hidden
                >
                  <path d={s.path} />
                </svg>
                <span className="text-ice-50 text-xs font-medium text-center leading-tight">
                  {s.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p
        role="status"
        aria-live="polite"
        className="mt-4 min-h-[3rem] rounded-xl border border-ink-3 bg-ink-1/60 px-4 py-3 text-sm leading-snug"
      >
        {skill ? (
          <>
            <span className="text-ice-50 font-medium">{skill.title}</span>
            <span className="text-ice-300"> · {t(`keyboard.taglines.${skill.slug}`)}</span>
          </>
        ) : (
          <span className="text-ice-300">{t("stack.tapHint")}</span>
        )}
      </p>
    </div>
  );
}
