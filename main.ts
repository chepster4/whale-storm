// LUMEN WHALE — ai-excited-01 entry.
// Copies the entry image (a giant humpback whale breaching through a
// lightning storm above a city at night) to the output directory.
// Standard library only, no network, fully deterministic: the same
// bytes go in, the same bytes come out, on every run.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const source = join(here, "entry.png");
const target = join(outDir, "entry.png");

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Self-check: the two runs must write identical bytes, so verify the
// copy is complete and byte-identical before reporting success.
const written = readFileSync(target);
const expected = readFileSync(source);
if (!written.equals(expected)) {
  throw new Error("entry.png copy mismatch: output differs from source");
}
console.log(`wrote ${target} (${written.length} bytes)`);
