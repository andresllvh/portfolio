import { removeBackground } from "@imgly/background-removal-node";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const input =
  process.argv[2] ??
  join(root, "public/images/andre-real.png");
const output =
  process.argv[3] ??
  join(root, "public/images/andre-real.png");
const backup = join(root, "public/images/andre-real.backup.png");

const assetDir = join(
  root,
  "node_modules/@imgly/background-removal-node/dist",
);
const publicPath = `file:///${assetDir.replace(/\\/g, "/")}/`;

const toFileUrl = (p) => `file:///${resolve(p).replace(/\\/g, "/")}`;

console.log("Input:", input);
console.log("Output:", output);
console.log("Loading model (first run may take a minute)...");

try {
  copyFileSync(input, backup);
  console.log("Backup saved:", backup);
} catch {
  /* input may already be backup path */
}

const tempOutput = output.replace(/(\.[^.]+)$/, ".nobg$1");

const blob = await removeBackground(toFileUrl(input), {
  publicPath,
  model: "medium",
  output: { format: "image/png", quality: 1 },
});

const buffer = Buffer.from(await blob.arrayBuffer());
mkdirSync(dirname(output), { recursive: true });
writeFileSync(tempOutput, buffer);
copyFileSync(tempOutput, output);

console.log(`Done: ${(buffer.length / 1024).toFixed(1)} KB -> ${output}`);
