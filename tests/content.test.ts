import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { projects } from "@/content/projects";
import { experiences } from "@/content/experiences";
import { certifications } from "@/content/certifications";
import { profile } from "@/content/profile";
import { SKILLS_FLAT, SKILLS_GRID } from "@/lib/skills";

const publicFile = (path: string) => join(process.cwd(), "public", path);

describe("projects", () => {
  it("have unique numbers and keyboard sections", () => {
    expect(new Set(projects.map((p) => p.num)).size).toBe(projects.length);
    expect(new Set(projects.map((p) => p.section)).size).toBe(projects.length);
  });

  it("alternate left and right so the keyboard can sit on the other side", () => {
    projects.forEach((p, i) => {
      expect(p.align).toBe(i % 2 === 0 ? "left" : "right");
    });
  });

  it("point every screenshot to a file that exists", () => {
    for (const p of projects) {
      for (const src of p.media ?? []) {
        expect(existsSync(publicFile(src)), `${p.num}: ${src}`).toBe(true);
      }
    }
  });

  it("only highlight keys that exist on the keyboard", () => {
    const slugs = new Set(SKILLS_FLAT.map((s) => s.slug));
    for (const p of projects) {
      for (const slug of p.highlights ?? []) {
        expect(slugs.has(slug), `${p.num}: ${slug}`).toBe(true);
      }
    }
  });

  it("use https for external links", () => {
    for (const p of projects) {
      for (const link of [p.url, p.github].filter(Boolean)) {
        expect(link).toMatch(/^https:\/\//);
      }
    }
  });

  it("have copy in both languages", () => {
    for (const p of projects) {
      for (const field of [p.name, p.desc, p.details]) {
        expect(field.pt.trim()).not.toBe("");
        expect(field.en.trim()).not.toBe("");
      }
    }
  });
});

describe("experiences", () => {
  it("have copy in both languages", () => {
    for (const exp of experiences) {
      for (const field of [exp.role, exp.period, exp.location, exp.summary, ...exp.bullets]) {
        expect(field.pt.trim()).not.toBe("");
        expect(field.en.trim()).not.toBe("");
      }
    }
  });
});

describe("certifications", () => {
  it("open with the Credly badge shown in the hero", () => {
    expect(certifications[0].url).toMatch(/^https:\/\/www\.credly\.com\/badges\//);
  });

  it("only link to a verification page over https", () => {
    for (const c of certifications.filter((c) => c.url)) {
      expect(c.url, c.name).toMatch(/^https:\/\/(www\.credly\.com\/badges|coursera\.org\/verify)\//);
    }
  });

  it("have the issue date in both languages", () => {
    for (const c of certifications) {
      expect(c.issued.pt.trim(), c.name).not.toBe("");
      expect(c.issued.en.trim(), c.name).not.toBe("");
    }
  });
});

describe("profile", () => {
  it("ships both resume PDFs", () => {
    expect(existsSync(publicFile(profile.cv.pt))).toBe(true);
    expect(existsSync(publicFile(profile.cv.en))).toBe(true);
  });
});

describe("skills keyboard", () => {
  it("is a 3×5 grid with unique keys", () => {
    expect(SKILLS_GRID).toHaveLength(3);
    SKILLS_GRID.forEach((row) => expect(row).toHaveLength(5));
    expect(new Set(SKILLS_FLAT.map((s) => s.slug)).size).toBe(15);
  });

  it("has valid icon colors", () => {
    for (const s of SKILLS_FLAT) {
      expect(s.hex, s.slug).toMatch(/^[0-9A-Fa-f]{6}$/);
    }
  });
});
