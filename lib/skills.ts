import {
  siCss,
  siGit,
  siHtml5,
  siJavascript,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siSass,
  siSupabase,
  siTypescript,
  siVite,
  siVitest,
} from "simple-icons";

export type SkillIcon = {
  title: string;
  slug: string;
  path: string;
  hex: string;
};

// 3×5 grid — consumed by the 3D keyboard (one icon per keycap) and, on mobile,
// by the flat list below for the static skills grid that replaces the
// hover-driven keyboard interaction. Taglines live in the i18n dictionary
// under `keyboard.taglines.<slug>`.
// Simple Icons no longer ships the AWS logo, so the AWS keycap uses a plain
// cloud glyph in the AWS orange.
const AWS: SkillIcon = {
  title: "AWS",
  slug: "aws",
  path: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z",
  hex: "FF9900",
};

export const SKILLS_GRID: readonly (readonly SkillIcon[])[] = [
  [siJavascript, siTypescript, siHtml5, siCss, siSass],
  [siReact, siNextdotjs, siNodedotjs, siPython, siVite],
  [siPostgresql, siSupabase, AWS, siGit, siVitest],
] as const;

export const SKILLS_FLAT: readonly SkillIcon[] = SKILLS_GRID.flat();
