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
  ["execução local", { GITHUB_ACTIONS: "false" }],
  ["pull request", { GITHUB_EVENT_NAME: "pull_request" }],
  ["outro repositório", { GITHUB_REPOSITORY: "fradelli/fork" }],
  ["outra ref", { GITHUB_REF: "refs/heads/feature" }],
  ["sem token", { NODE_AUTH_TOKEN: "" }],
];

describe("publish context guard", () => {
  it("aceita somente o workflow de push em main", () => {
    const result = run();

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Contexto de publicação validado");
  });

  it.each(invalidContexts)("recusa %s", (_scenario, environment) => {
    const result = run(environment);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Publicação recusada");
    expect(result.stdout).not.toContain("non-secret-test-value");
    expect(result.stderr).not.toContain("non-secret-test-value");
  });
});
