import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const repositoryRoot = new URL("../../", import.meta.url);

describe("release configuration", () => {
  it("keeps publication on GitHub Packages behind the release guard", async () => {
    const packageJson = JSON.parse(
      await readFile(new URL("package.json", repositoryRoot), "utf8"),
    ) as {
      publishConfig: { access: string; registry: string };
      scripts: Record<string, string>;
    };

    expect(packageJson.publishConfig).toEqual({
      access: "restricted",
      registry: "https://npm.pkg.github.com",
    });
    expect(packageJson.scripts.release).toBe("changeset publish");
    expect(packageJson.scripts.prepublishOnly).toBe("node scripts/verify-publish-context.mjs");
  });

  it("pins actions and grants write permissions only in the release workflow", async () => {
    const workflow = await readFile(
      new URL(".github/workflows/release.yml", repositoryRoot),
      "utf8",
    );

    expect(workflow).toContain("contents: write");
    expect(workflow).toContain("pull-requests: write");
    expect(workflow).toContain("packages: write");
    expect(workflow).toContain("changesets/action@ae32849d5ba541f9ae29e40e22a623bc13562f51");
    expect(workflow).toContain("NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}");
    expect(workflow).not.toContain("workflow_dispatch");
  });
});
