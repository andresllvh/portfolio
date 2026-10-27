import type { Certification } from "./types";

// The first entry is also the badge shown in the hero.
export const certifications: Certification[] = [
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    issued: {
      pt: "Out/2026 · válida até Out/2029",
      en: "Oct/2026 · valid until Oct/2029",
    },
    url: "https://www.credly.com/badges/bfe482f2-8501-4e6f-80ff-fc82ae5f2998",
  },
  {
    name: "AWS re/Start Graduate",
    issuer: "Amazon Web Services · Escola da Nuvem",
    issued: {
      pt: "Fev/2026 · 270 h de Cloud Computing",
      en: "Feb/2026 · 270-hour Cloud Computing program",
    },
    url: "https://www.credly.com/badges/08fd3b38-b129-47bd-97e9-4e951746be27",
  },
];
