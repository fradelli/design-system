import { execFileSync } from "node:child_process";
import { mkdir, readFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";

const args = process.argv.slice(2);
if (args.length > 1 || (args.length === 1 && args[0] !== "--check")) {
  throw new Error("Uso: node scripts/build-tokens.mjs [--check]");
}

const check = args[0] === "--check";
const outputDirectory = check ? ".tmp/tokens/" : "src/styles/";
const cli = join("node_modules", "style-dictionary", "bin", "style-dictionary.js");
const generated = join(outputDirectory, "tokens.generated.css");

await mkdir(dirname(generated), { recursive: true });
execFileSync(process.execPath, [cli, "build", "--config", "style-dictionary.config.mjs"], {
  env: { ...process.env, FRADELLI_TOKENS_BUILD_PATH: outputDirectory },
  stdio: "inherit",
});

if (check) {
  const [expected, actual] = await Promise.all([
    readFile("src/styles/tokens.generated.css", "utf8"),
    readFile(generated, "utf8"),
  ]);
  await rm(".tmp/tokens", { recursive: true, force: true });
  if (expected !== actual) {
    throw new Error("Tokens gerados estão divergentes. Execute npm run tokens:build.");
  }
}
