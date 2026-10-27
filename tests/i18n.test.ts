import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DICT, LANGUAGES, translate } from "@/lib/i18n";
import { SKILLS_FLAT } from "@/lib/skills";

type Node = { [key: string]: Node } | { pt: string; en: string };

function leaves(node: Node, prefix = ""): [string, Record<string, string>][] {
  if (typeof (node as { pt?: unknown }).pt === "string") {
    return [[prefix, node as Record<string, string>]];
  }
  return Object.entries(node).flatMap(([key, child]) =>
    leaves(child as Node, prefix ? `${prefix}.${key}` : key)
  );
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("dictionary", () => {
  it("has every entry in Portuguese and English", () => {
    for (const [path, leaf] of leaves(DICT as unknown as Node)) {
      for (const lang of LANGUAGES) {
        expect(leaf[lang]?.trim(), `${path}.${lang}`).toBeTruthy();
      }
    }
  });

  it("has a tagline for every key on the keyboard", () => {
    for (const s of SKILLS_FLAT) {
      for (const lang of LANGUAGES) {
        const key = `keyboard.taglines.${s.slug}`;
        expect(translate(key, lang), key).not.toBe(key);
      }
    }
  });

  it("resolves every t(\"...\") key used in the components", () => {
    const root = process.cwd();
    const files = ["app", "components"].flatMap((d) => sourceFiles(join(root, d)));
    const keys = new Set<string>();
    for (const file of files) {
      for (const match of readFileSync(file, "utf8").matchAll(/\bt\("([\w.]+)"\)/g)) {
        keys.add(match[1]);
      }
    }
    expect(keys.size).toBeGreaterThan(10);
    for (const key of keys) {
      for (const lang of LANGUAGES) {
        expect(translate(key, lang), key).not.toBe(key);
      }
    }
  });
});
