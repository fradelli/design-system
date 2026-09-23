import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";

const temporaryDirectory = ".tmp/package";
const npmCli = process.env.npm_execpath;
const publintCli = join("node_modules", "publint", "src", "cli.js");
const attwCli = join("node_modules", "@arethetypeswrong", "cli", "dist", "index.js");

if (!npmCli) throw new Error("npm_execpath não está disponível. Execute via npm run pack:check.");

function runNodeCli(cli, args, options = {}) {
  return execFileSync(process.execPath, [cli, ...args], options);
}
const expectedFiles = [
  "CHANGELOG.md",
  "README.md",
  "dist/components/alert-dialog/index.d.ts",
  "dist/components/alert-dialog/index.js",
  "dist/components/alert/index.d.ts",
  "dist/components/alert/index.js",
  "dist/components/badge/index.d.ts",
  "dist/components/badge/index.js",
  "dist/components/button/index.d.ts",
  "dist/components/button/index.js",
  "dist/components/card/index.d.ts",
  "dist/components/card/index.js",
  "dist/components/field/index.d.ts",
  "dist/components/field/index.js",
  "dist/components/input/index.d.ts",
  "dist/components/input/index.js",
  "dist/components/label/index.d.ts",
  "dist/components/label/index.js",
  "dist/components/loading-region/index.d.ts",
  "dist/components/loading-region/index.js",
  "dist/components/pending-button/index.d.ts",
  "dist/components/pending-button/index.js",
  "dist/components/separator/index.d.ts",
  "dist/components/separator/index.js",
  "dist/components/sheet/index.d.ts",
  "dist/components/sheet/index.js",
  "dist/components/skeleton/index.d.ts",
  "dist/components/skeleton/index.js",
  "dist/components/status-badge/index.d.ts",
  "dist/components/status-badge/index.js",
  "dist/index.d.ts",
  "dist/index.js",
  "dist/lib/cn.d.ts",
  "dist/lib/cn.js",
  "dist/styles.css",
  "package.json",
];

await rm(temporaryDirectory, { recursive: true, force: true });
await mkdir(temporaryDirectory, { recursive: true });

const dryRun = JSON.parse(
  runNodeCli(npmCli, ["pack", "--dry-run", "--json", "--ignore-scripts"], {
    encoding: "utf8",
  }),
);
const actualFiles = dryRun[0].files.map(({ path }) => path).sort();

if (JSON.stringify(actualFiles) !== JSON.stringify(expectedFiles)) {
  throw new Error(
    `Tarball fora da allowlist.\nEsperado: ${expectedFiles.join(", ")}\nRecebido: ${actualFiles.join(", ")}`,
  );
}

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const exportTargets = Object.values(packageJson.exports).flatMap((entry) =>
  typeof entry === "string" ? [entry] : Object.values(entry),
);

for (const target of exportTargets) {
  await readFile(target.replace(/^\.\//, ""));
}

const forbiddenPatterns = [/@\//u, /next(?:\/|\b)/iu, /sandicts/iu, /kaizen/iu];
for (const file of await readdir("dist", { recursive: true })) {
  const path = join("dist", file);
  if ((await stat(path)).isDirectory()) continue;
  const content = await readFile(path, "utf8");
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      throw new Error(`Conteúdo proibido ${pattern} encontrado em ${path}.`);
    }
  }
}

runNodeCli(npmCli, ["pack", "--pack-destination", temporaryDirectory, "--ignore-scripts"], {
  stdio: "inherit",
});
const tarballs = (await readdir(temporaryDirectory)).filter((file) => file.endsWith(".tgz"));
if (tarballs.length !== 1) {
  throw new Error(`Esperado um tarball; encontrados ${tarballs.length}.`);
}

const tarball = join(temporaryDirectory, tarballs[0]);
runNodeCli(publintCli, [tarball, "--strict"], { stdio: "inherit" });
runNodeCli(attwCli, [tarball, "--profile", "esm-only", "--entrypoints", "."], {
  stdio: "inherit",
});

console.log(`Tarball validado: ${tarball}`);
