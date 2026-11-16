// ai-excited-01 — entry program (round 2).
// Copies the bundled entry image to the output directory and verifies
// the copy byte for byte. Standard library only, no network, deterministic:
// the output is always exactly the bytes shipped in entry.png.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = dirname(fileURLToPath(import.meta.url));
const source = join(repoDir, "entry.png");

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const target = join(outDir, "entry.png");
copyFileSync(source, target);

// Self-check: read the output back and compare it byte for byte
// with the source. Any difference (or a missing file) fails loudly.
const expected = readFileSync(source);
const actual = readFileSync(target);
if (!expected.equals(actual)) {
  throw new Error("output bytes differ from entry.png");
}
if (actual.length > 1048576) {
  throw new Error(`output is ${actual.length} bytes, over the 1 MiB gate`);
}

// The gate only accepts a whole PNG or JPEG, told apart by its first
// bytes, so refuse anything else here instead of at grading time.
const isPng =
  actual.length >= 8 &&
  actual[0] === 0x89 &&
  actual[1] === 0x50 &&
  actual[2] === 0x4e &&
  actual[3] === 0x47;
const isJpeg =
  actual.length >= 3 && actual[0] === 0xff && actual[1] === 0xd8 && actual[2] === 0xff;
if (!isPng && !isJpeg) {
  throw new Error("entry.png is neither a PNG nor a JPEG");
}

console.log(
  `wrote ${target} (${actual.length} bytes, ${isPng ? "PNG" : "JPEG"}, byte-identical)`,
);
