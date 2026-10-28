import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";

const temporaryDirectory = ".tmp/package";
const npmCli = process.env.npm_execpath;
const publintCli = join("node_modules", "publint", "src", "cli.js");
const attwCli = join("node_modules", "@arethetypeswrong", "cli", "dist", "index.js");

if (!npmCli) throw new Error("npm_execpath is not available. Run this through npm run pack:check.");

function runNodeCli(cli, args, options = {}) {
  return execFileSync(process.execPath, [cli, ...args], options);
}
const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const catalog = JSON.parse(await readFile("src/icons/catalog.json", "utf8"));
if (catalog.version !== packageJson.dependencies[catalog.dependency]) {
  throw new Error("The reviewed icon catalog does not match the pinned dependency.");
}
const iconNames = catalog.icons.map(({ name }) => name);
if (
  new Set(iconNames).size !== iconNames.length ||
  iconNames.some((name) => !/^[A-Z][A-Za-z0-9]*$/u.test(name))
) {
  throw new Error("The icon manifest must contain unique canonical module names.");
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
  "dist/components/navigation-item/index.d.ts",
  "dist/components/navigation-item/index.js",
  "dist/components/pending-button/index.d.ts",
  "dist/components/pending-button/index.js",
  "dist/components/popover/index.d.ts",
  "dist/components/popover/index.js",
  "dist/components/popover/popover-position.d.ts",
  "dist/components/popover/popover-position.js",
  "dist/components/popover/use-popover-position.d.ts",
  "dist/components/popover/use-popover-position.js",
  "dist/components/radio-group/index.d.ts",
  "dist/components/radio-group/index.js",
  "dist/components/separator/index.d.ts",
  "dist/components/separator/index.js",
  "dist/components/sheet/index.d.ts",
  "dist/components/sheet/index.js",
  "dist/components/skeleton/index.d.ts",
  "dist/components/skeleton/index.js",
  "dist/components/status-badge/index.d.ts",
  "dist/components/status-badge/index.js",
  "dist/components/switch/index.d.ts",
  "dist/components/switch/index.js",
  "dist/icons/index.d.ts",
  "dist/icons/index.js",
  "dist/icons/icon.types.d.ts",
  "dist/icons/icon.types.js",
  ...iconNames.flatMap((name) => [
    `dist/icons/generated/${name}.d.ts`,
    `dist/icons/generated/${name}.js`,
  ]),
  "dist/index.d.ts",
  "dist/index.js",
  "dist/lib/cn.d.ts",
  "dist/lib/cn.js",
  "dist/lib/slot.d.ts",
  "dist/lib/slot.js",
  "dist/styles.css",
  "package.json",
].sort();

await rm(temporaryDirectory, { recursive: true, force: true });
await mkdir(temporaryDirectory, { recursive: true });

const dryRun = JSON.parse(
  runNodeCli(npmCli, ["pack", "--dry-run", "--json", "--ignore-scripts"], {
    encoding: "utf8",
  }),
);
// npm 11 emits an array; npm 12 keys the same metadata by package name.
const packed = Array.isArray(dryRun) ? dryRun[0] : dryRun[packageJson.name];
if (!Array.isArray(packed?.files) || !packed.files.length) {
  throw new Error("npm pack did not return a package file manifest.");
}
const actualFiles = packed.files.map(({ path }) => path).sort();

if (JSON.stringify(actualFiles) !== JSON.stringify(expectedFiles)) {
  throw new Error(
    `Tarball fora da allowlist.\nEsperado: ${expectedFiles.join(", ")}\nRecebido: ${actualFiles.join(", ")}`,
  );
}

const exportTargets = Object.entries(packageJson.exports).flatMap(([subpath, entry]) => {
  const targets = typeof entry === "string" ? [entry] : Object.values(entry);
  if (subpath === "./icons/*") {
    if (
      entry.types !== "./dist/icons/generated/*.d.ts" ||
      entry.import !== "./dist/icons/generated/*.js"
    ) {
      throw new Error("The icon wildcard must point only to reviewed generated modules.");
    }
    return iconNames.flatMap((name) => targets.map((target) => target.replace("*", name)));
  }
  if (subpath.includes("*") || targets.some((target) => target.includes("*"))) {
    throw new Error(`Unreviewed wildcard export: ${subpath}`);
  }
  return targets;
});

for (const target of exportTargets) {
  await readFile(target.replace(/^\.\//, ""));
}

const forbiddenPatterns = [
  /@\//u,
  /(?:from|import|require\()\s*["']next(?:\/[^"']*)?["']/iu,
  /sandicts/iu,
  /kaizen/iu,
];
for (const file of await readdir("dist", { recursive: true })) {
  const path = join("dist", file);
  if ((await stat(path)).isDirectory()) continue;
  const content = await readFile(path, "utf8");
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      throw new Error(`Forbidden content ${pattern} found in ${path}.`);
    }
  }
}

runNodeCli(
  npmCli,
  ["pack", "--pack-destination", temporaryDirectory, "--ignore-scripts", "--json"],
  {
    encoding: "utf8",
  },
);
const tarballs = (await readdir(temporaryDirectory)).filter((file) => file.endsWith(".tgz"));
if (tarballs.length !== 1) {
  throw new Error(`Esperado um tarball; encontrados ${tarballs.length}.`);
}

const tarball = join(temporaryDirectory, tarballs[0]);
runNodeCli(publintCli, [tarball, "--strict"], { stdio: "inherit" });
runNodeCli(
  attwCli,
  [
    tarball,
    "--profile",
    "esm-only",
    "--entrypoints",
    ".",
    "./icons",
    "./icons/Barbell",
    "./icons/Trash",
  ],
  {
    stdio: "inherit",
  },
);

console.log(
  `Validated ${actualFiles.length} files and ${iconNames.length} icon subpaths in ${tarball}.`,
);
