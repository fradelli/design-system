import { execFileSync, spawn } from "node:child_process";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { join, resolve, sep } from "node:path";
import { gzipSync } from "node:zlib";
import { chromium } from "playwright";

const root = resolve(".");
const fixtureRoot = join(root, ".tmp", "next-icons");
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("Run this fixture through npm run fixtures:next.");
const tarballs = (await readdir(join(root, ".tmp/package"))).filter((file) =>
  file.endsWith(".tgz"),
);
if (tarballs.length !== 1) throw new Error("Run npm run pack:check first.");
const tarball = join(root, ".tmp/package", tarballs[0]);
const drawings = [
  "Trash",
  "Plus",
  "PencilSimple",
  "X",
  "CaretUp",
  "CaretDown",
  "Play",
  "Pause",
  "ArrowLeft",
  "ArrowRight",
  "ChatCircle",
  "Barbell",
  "ForkKnife",
  "Check",
  "Info",
  "Warning",
  "Clock",
  "CalendarBlank",
  "ArrowClockwise",
  "CheckCircle",
];

async function removeFixtureOutput(path) {
  const target = resolve(path);
  if (target !== fixtureRoot && !target.startsWith(`${fixtureRoot}${sep}`)) {
    throw new Error("Refusing to remove a path outside this isolated fixture.");
  }
  await rm(target, { recursive: true, force: true });
}
await removeFixtureOutput(fixtureRoot);
await mkdir(fixtureRoot, { recursive: true });
await cp(join(root, "fixtures/next-consumer"), fixtureRoot, { recursive: true });
execFileSync(
  process.execPath,
  [npmCli, "install", "--ignore-scripts", "--no-audit", "--no-fund", tarball],
  { cwd: fixtureRoot, stdio: "inherit", windowsHide: true },
);

function clientSource(names, updated = false) {
  return (
    '"use client";\nimport { useState } from "react";\n' +
    names.map((name) => `import { ${name}Icon } from "@fradelli/ui/icons/${name}";`).join("\n") +
    `\nexport function ClientIcons() { const [count,setCount] = useState(0); return <section><h2>Client icon fixture${updated ? " updated" : ""}</h2>` +
    names
      .map(
        (name) =>
          `<${name}Icon size={20} weight="regular" data-drawing="${name}" aria-hidden="true" focusable="false" />`,
      )
      .join("") +
    '<button type="button" onClick={() => setCount(count+1)}>Count {count}</button></section>; }\n'
  );
}

async function availablePort() {
  const server = createServer();
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No local fixture port.");
  await new Promise((done) => server.close(done));
  return address.port;
}

async function stop(child) {
  if (child.exitCode !== null) return;
  if (process.platform === "win32") {
    execFileSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
  } else {
    const exited = new Promise((done) => child.once("exit", done));
    process.kill(-child.pid, "SIGTERM");
    await exited;
  }
}

const metrics = {
  next: "16.4.2",
  artifact: tarballs[0],
  note: "Timings are single-run local observations. Client bytes include the Next runtime; icon source bytes are analyzed source, not transferred bytes.",
  cases: [],
};
const nextCli = join(fixtureRoot, "node_modules/next/dist/bin/next");
const browser = await chromium.launch();
try {
  for (const count of [2, 20]) {
    const names = drawings.slice(0, count);
    const clientFile = join(fixtureRoot, "app/client-icons.tsx");
    await removeFixtureOutput(join(fixtureRoot, ".next"));
    await writeFile(clientFile, clientSource(names));
    const port = await availablePort();
    const startedAt = performance.now();
    const child = spawn(
      process.execPath,
      [nextCli, "dev", "--hostname", "127.0.0.1", "--port", String(port)],
      {
        cwd: fixtureRoot,
        windowsHide: true,
        detached: process.platform !== "win32",
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    let devLog = "";
    child.stdout.on("data", (chunk) => {
      devLog += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      devLog += chunk.toString();
    });
    const page = await browser.newPage();
    let coldDevMs, hmrMs;
    try {
      const deadline = Date.now() + 120000;
      while (true) {
        try {
          const response = await fetch(`http://127.0.0.1:${port}`);
          if (response.ok) break;
        } catch {
          /* Wait for the owned dev server. */
        }
        if (child.exitCode !== null || Date.now() > deadline)
          throw new Error(`Fixture dev server failed.\n${devLog}`);
        await new Promise((done) => setTimeout(done, 250));
      }
      await page.goto(`http://127.0.0.1:${port}`);
      const primary = page.locator("[data-hover-fixture]");
      const cursor = await primary.evaluate((button) => globalThis.getComputedStyle(button).cursor);
      if (cursor !== "pointer") throw new Error("Enabled Button must show a pointer cursor.");
      await primary.hover();
      await page.waitForFunction(() => {
        const button = globalThis.document.querySelector("[data-hover-fixture]");
        if (!button) return false;
        const pixel = globalThis.document.createElement("canvas").getContext("2d");
        if (!pixel) return false;
        const style = globalThis.getComputedStyle(button);
        pixel.fillStyle = style.backgroundColor;
        pixel.fillRect(0, 0, 1, 1);
        return pixel.getImageData(0, 0, 1, 1).data[3] === 250 && style.opacity === "1";
      });
      if (
        (await page
          .locator("[data-disabled-fixture]")
          .evaluate((button) => globalThis.getComputedStyle(button).cursor)) !== "default"
      ) {
        throw new Error("Disabled Button must retain its inactive cursor.");
      }
      await page.getByRole("button", { name: "Count 0" }).click();
      await page.getByRole("button", { name: "Count 1" }).waitFor();
      if (
        (await page.locator("[data-drawing]").count()) !== count ||
        (await page.locator("[data-server-icon]").count()) !== 2
      )
        throw new Error("Server/client icons did not hydrate correctly.");
      coldDevMs = Math.round(performance.now() - startedAt);
      const hmrStart = performance.now();
      await writeFile(clientFile, clientSource(names, true));
      await page
        .getByRole("heading", { name: "Client icon fixture updated", exact: true })
        .waitFor();
      await page.getByRole("button", { name: "Count 1" }).waitFor();
      hmrMs = Math.round(performance.now() - hmrStart);
    } finally {
      await page.close();
      await stop(child);
      await writeFile(join(fixtureRoot, `dev-${count}.log`), devLog);
    }
    await removeFixtureOutput(join(fixtureRoot, ".next"));
    const buildStartedAt = performance.now();
    execFileSync(process.execPath, [nextCli, "build"], {
      cwd: fixtureRoot,
      stdio: "inherit",
      windowsHide: true,
    });
    const buildMs = Math.round(performance.now() - buildStartedAt);
    const chunkDirectory = join(fixtureRoot, ".next/static/chunks");
    const files = await readdir(chunkDirectory, { recursive: true });
    const modules = new Map();
    function collectSources(map) {
      for (let index = 0; index < (map.sources ?? []).length; index++)
        modules.set(map.sources[index], map.sourcesContent?.[index] ?? "");
      for (const section of map.sections ?? []) collectSources(section.map);
    }
    let clientJsBytes = 0,
      clientJsGzipBytes = 0;
    for (const file of files) {
      if (file.endsWith(".js.map"))
        collectSources(JSON.parse(await readFile(join(chunkDirectory, file), "utf8")));
      if (file.endsWith(".js")) {
        const content = await readFile(join(chunkDirectory, file));
        clientJsBytes += content.length;
        clientJsGzipBytes += gzipSync(content).length;
      }
    }
    const iconModules = [...modules].filter(([name]) =>
      /@fradelli\/ui\/dist\/icons\/generated\//u.test(name),
    );
    const bundledNames = iconModules
      .map(([name]) => name.match(/generated\/([A-Za-z0-9]+)\.js/u)?.[1])
      .filter(Boolean)
      .sort();
    if (JSON.stringify(bundledNames) !== JSON.stringify([...names].sort()))
      throw new Error(`Unexpected client icon modules: ${bundledNames.join(", ")}`);
    const phosphorModules = [...modules].filter(([name]) => name.includes("@phosphor-icons/react"));
    if (phosphorModules.some(([name]) => /\/(?:csr|IconBase|context)\b/iu.test(name)))
      throw new Error("SSR icon imports unexpectedly retained the CSR context path.");
    metrics.cases.push({
      icons: count,
      coldDevMs,
      hmrMs,
      buildMs,
      clientJsBytes,
      clientJsGzipBytes,
      iconWrapperModules: iconModules.length,
      phosphorModules: phosphorModules.length,
      analyzedIconSourceBytes: [...iconModules, ...phosphorModules].reduce(
        (total, [, source]) => total + Buffer.byteLength(source),
        0,
      ),
    });
    console.log(
      `Validated Next Server/Client Components and retained HMR state with ${count} icons.`,
    );
  }
} finally {
  await browser.close();
}
await writeFile(join(root, ".tmp/icon-next-metrics.json"), `${JSON.stringify(metrics, null, 2)}\n`);
console.log(JSON.stringify(metrics, null, 2));
