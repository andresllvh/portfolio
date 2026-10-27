import type { Lang } from "@/lib/i18n";

// Localised copy lives in `{ pt, en }` objects so sections can render with a
// plain array.map(). Tech names stay as plain strings (they're brand names).
export type Localised = { pt: string; en: string };

export function pick<T>(loc: { pt: T; en: T }, lang: Lang): T {
  return loc[lang];
}

export type ProjectSection = "project1" | "project2" | "project3" | "project4";

export type ProjectDetail = {
  num: string;
  name: Localised;
  // Main technologies — shown both on the card and in the modal.
  stack: string[];
  desc: Localised; // short card copy
  details: Localised; // longer modal copy
  url?: string;
  github?: string;
  badge?: Localised;
  // simple-icons slugs from the 3D keyboard to light up + animate when
  // this project's section is active.
  highlights?: string[];
  // Optional screenshot/preview URLs for the carousel. When missing the
  // modal falls back to stylised placeholder slides.
  media?: string[];
};

export type Project = ProjectDetail & {
  align: "left" | "right";
  section: ProjectSection;
};

export type Experience = {
  role: Localised;
  company: string;
  period: Localised;
  location: Localised;
  summary: Localised;
  bullets: Localised[];
  stack: string[];
};

export type Certification = {
  name: string;
  issuer: string;
  issued: Localised;
  url: string;
};
