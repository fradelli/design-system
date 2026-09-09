import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { readTokenDocument, resolveToken, walkTokens } from "./token-test-utils.js";

const primitives = readTokenDocument("tokens/primitives.json");
const semantic = readTokenDocument("tokens/semantic.dark.json");
const documents = [primitives, semantic];

describe("design tokens", () => {
  it("keeps semantic values as resolvable aliases", () => {
    walkTokens(semantic, (path, value) => {
      expect(value, path).toMatch(/^\{.+\}$/u);
      expect(() => resolveToken(documents, path)).not.toThrow();
    });
  });

  it("defines eight complete visual categories", () => {
    const categories = Object.keys((semantic.color as Record<string, unknown>).category as object);
    expect(categories).toHaveLength(8);
    for (const category of categories) {
      for (const role of ["solid", "subtle", "foreground", "border"]) {
        expect(resolveToken(documents, `color.category.${category}.${role}`)).toBeTruthy();
      }
    }
  });

  it("keeps brand and destructive independent", () => {
    expect(resolveToken(documents, "color.brand")).not.toBe(
      resolveToken(documents, "color.status.destructive.solid"),
    );
  });

  it("keeps generated CSS synchronized", () => {
    const css = readFileSync("src/styles/tokens.generated.css", "utf8");
    expect(css).toContain("--fd-color-background");
    expect(css).not.toContain("[object Object]");
  });
});
