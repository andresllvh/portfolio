import sharp from "sharp";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(root, "public/images/andre-real.from-git.png");
const out = resolve(root, "public/images/andre-real.png");

await sharp(src)
  .resize(571, 1024, { fit: "fill" })
  .png()
  .toFile(out);

const meta = await sharp(out).metadata();
console.log(`andre-real.png -> ${meta.width}x${meta.height}`);
