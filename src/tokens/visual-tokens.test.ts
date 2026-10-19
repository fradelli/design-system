import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio, readTokenDocument, resolveToken, walkTokens } from "./token-test-utils.js";

const visual = readTokenDocument("tokens/semantic.visual.json");
const documents = [
  readTokenDocument("tokens/primitives.json"),
  readTokenDocument("tokens/semantic.dark.json"),
  visual,
];

describe("shared visual foundation", () => {
  it("resolves aliases in every visual token, including derived CSS strings", () => {
    walkTokens(visual, (path, value) => {
      expect(() => resolveToken(documents, path)).not.toThrow();
      if (typeof value === "string") {
        for (const match of value.matchAll(/\{([^{}]+)\}/gu)) {
          expect(() => resolveToken(documents, match[1]!)).not.toThrow();
        }
      }
    });
  });

  it("generates valid material and typographic values", () => {
    const css = readFileSync("src/styles/tokens.generated.css", "utf8");
    expect(css).toContain("--fd-surface-glass-blur: 12px");
    expect(css).toContain("--fd-text-card-size: var(--fd-font-size-lg)");
    expect(css).toContain("--fd-text-section-weight: var(--fd-font-weight-heading)");
    expect(css).toContain(
      "--fd-surface-glass-background: color-mix(in srgb, var(--fd-color-surface) 80%, transparent)",
    );
    expect(css).not.toMatch(/\{(?:color|font)\./u);
    expect(css).not.toContain("[object Object]");
  });

  it("keeps normal and muted text readable on glass over a worst-case white background", () => {
    // Per-channel sRGB composition over white, before any blur contribution.
    const composed = "#434344";
    expect(
      contrastRatio(resolveToken(documents, "color.foreground") as string, composed),
    ).toBeGreaterThanOrEqual(4.5);
    // Muted text requires a more opaque surface on bright artwork.
    expect(
      contrastRatio(resolveToken(documents, "color.mutedForeground") as string, "#2a2a2c"),
    ).toBeGreaterThanOrEqual(4.5);
  });
});
