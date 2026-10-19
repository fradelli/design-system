import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const workflowUrl = new URL("../../.github/workflows/ci.yml", import.meta.url);

describe("Storybook publication boundaries", () => {
  it("keeps deployment after validation and limited to trusted main events", async () => {
    const source = await readFile(workflowUrl, "utf8");
    const deploy = source.split("\n  deploy:")[1]!;
    expect(deploy).toMatch(/needs: validate/u);
    expect(deploy).toContain("github.repository == 'fradelli/design-system'");
    expect(deploy).toContain("github.ref == 'refs/heads/main'");
    expect(deploy).toContain(
      "github.event_name == 'push' || github.event_name == 'workflow_dispatch'",
    );
    expect(source).not.toContain("pull_request_target");
    expect(source).toContain("cancel-in-progress: ${{ github.event_name == 'pull_request' }}");
  });
  it("does not grant deploy permissions to PR validation and publishes only the generated catalog", async () => {
    const source = await readFile(workflowUrl, "utf8");
    const [validation, deploy] = source.split("\n  deploy:");
    expect(validation).not.toContain("pages: write");
    expect(validation).not.toContain("id-token: write");
    expect(validation).toContain("path: storybook-static");
    expect(deploy).toContain("pages: write");
    expect(deploy).toContain("id-token: write");
    expect(deploy).toContain("name: github-pages");
    expect(source).not.toContain("npm publish");
    for (const match of source.matchAll(/uses: ([^\s#]+)/gu))
      expect(match[1]).toMatch(/@[a-f0-9]{40}$/u);
  });
});
