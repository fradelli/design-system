import { mkdir, readFile, writeFile } from "node:fs/promises";

await mkdir("dist", { recursive: true });
const source = await readFile("src/styles/styles.css", "utf8");
const tokens = await readFile("src/styles/tokens.generated.css", "utf8");
const importPattern = /@import "\.\/tokens\.generated\.css" layer\(fradelli-ui\.tokens\);/gu;
const matches = source.match(importPattern) ?? [];

if (matches.length !== 1) {
  throw new Error(`Esperado um import de tokens; encontrados ${matches.length}.`);
}

await writeFile("dist/styles.css", source.replace(importPattern, tokens.trim()), "utf8");
