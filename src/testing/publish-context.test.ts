import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const scriptPath = fileURLToPath(
  new URL("../../scripts/verify-publish-context.mjs", import.meta.url),
);

const validEnvironment = {
  ...process.env,
  GITHUB_ACTIONS: "true",
  GITHUB_EVENT_NAME: "push",
  GITHUB_REPOSITORY: "fradelli/design-system",
  GITHUB_REF: "refs/heads/main",
  NODE_AUTH_TOKEN: "non-secret-test-value",
};

function run(overrides: NodeJS.ProcessEnv = {}) {
  return spawnSync(process.execPath, [scriptPath], {
    encoding: "utf8",
    env: { ...validEnvironment, ...overrides },
  });
}

const invalidContexts: Array<[string, NodeJS.ProcessEnv]> = [
  ["local execution", { GITHUB_ACTIONS: "false" }],
  ["pull request", { GITHUB_EVENT_NAME: "pull_request" }],
  ["another repository", { GITHUB_REPOSITORY: "fradelli/fork" }],
  ["another ref", { GITHUB_REF: "refs/heads/feature" }],
  ["missing token", { NODE_AUTH_TOKEN: "" }],
];

describe("publish context guard", () => {
  it("accepts only a push workflow on main", () => {
    const result = run();

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Publishing context validated");
  });

  it.each(invalidContexts)("denies %s", (_scenario, environment) => {
    const result = run(environment);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Publishing denied");
    expect(result.stdout).not.toContain("non-secret-test-value");
    expect(result.stderr).not.toContain("non-secret-test-value");
  });
});
