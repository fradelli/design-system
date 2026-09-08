import { execFileSync } from "node:child_process";
import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(".");
const packageDirectory = join(root, ".tmp", "package");
const fixtureDirectory = join(root, ".tmp", "fixtures");
const npmCli = process.env.npm_execpath;
const pnpmCli = join(root, "node_modules", "pnpm", "bin", "pnpm.mjs");
const tarballs = (await readdir(packageDirectory)).filter((file) => file.endsWith(".tgz"));

if (!npmCli)
  throw new Error("npm_execpath não está disponível. Execute via npm run fixtures:check.");

if (tarballs.length !== 1) {
  throw new Error("Execute npm run pack:check antes das fixtures.");
}

const tarball = join(packageDirectory, tarballs[0]);
await rm(fixtureDirectory, { recursive: true, force: true });
await mkdir(fixtureDirectory, { recursive: true });

function runNodeCli(cli, args, cwd, encoding) {
  return execFileSync(process.execPath, [cli, ...args], {
    cwd,
    encoding,
    stdio: encoding ? undefined : "inherit",
  });
}

function collectVersions(tree, packageName, versions = new Set()) {
  if (!tree || typeof tree !== "object") return versions;
  if (tree.name === packageName && typeof tree.version === "string") versions.add(tree.version);
  for (const [name, dependency] of Object.entries(tree.dependencies ?? {})) {
    if (name === packageName && typeof dependency.version === "string") {
      versions.add(dependency.version);
    }
    collectVersions(dependency, packageName, versions);
  }
  return versions;
}

async function validateFixture(name, manager) {
  const source = join(root, "fixtures", name);
  const target = join(fixtureDirectory, name);
  await cp(source, target, { recursive: true });

  if (manager === "npm") {
    runNodeCli(npmCli, ["install", "--ignore-scripts", tarball], target);
    runNodeCli(npmCli, ["run", "typecheck"], target);
    runNodeCli(npmCli, ["run", "smoke"], target);
    const tree = JSON.parse(runNodeCli(npmCli, ["ls", "--json", "--all"], target, "utf8"));
    for (const dependency of ["react", "react-dom"]) {
      const versions = collectVersions(tree, dependency);
      if (versions.size !== 1)
        throw new Error(`${name}: ${dependency} possui ${versions.size} versões.`);
    }
    return;
  }

  runNodeCli(pnpmCli, ["add", "--ignore-scripts", tarball], target);
  runNodeCli(pnpmCli, ["run", "typecheck"], target);
  runNodeCli(pnpmCli, ["run", "smoke"], target);
  const list = JSON.parse(
    runNodeCli(pnpmCli, ["list", "--json", "--depth", "Infinity"], target, "utf8"),
  );
  const tree = Array.isArray(list) ? list[0] : list;
  for (const dependency of ["react", "react-dom"]) {
    const versions = collectVersions(tree, dependency);
    if (versions.size !== 1)
      throw new Error(`${name}: ${dependency} possui ${versions.size} versões.`);
  }
}

await validateFixture("npm-consumer", "npm");
await validateFixture("pnpm-consumer", "pnpm");
console.log("Fixtures npm e pnpm validadas com um único React.");
