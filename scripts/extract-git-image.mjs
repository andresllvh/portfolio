import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "public/images/andre-real.from-git.png");
const buf = execSync("git show 2f7d979:public/images/andre-real.png", {
  cwd: root,
  encoding: "buffer",
  maxBuffer: 20 * 1024 * 1024,
});
writeFileSync(out, buf);
const w = buf.readUInt32BE(16);
const h = buf.readUInt32BE(20);
console.log(`Saved ${w}x${h} (${buf.length} bytes) -> ${out}`);
