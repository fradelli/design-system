import { describe, expect, it } from "vitest";

import { contrastRatio, readTokenDocument, resolveToken } from "./token-test-utils.js";

const documents = [
  readTokenDocument("tokens/primitives.json"),
  readTokenDocument("tokens/semantic.dark.json"),
];
const color = (path: string) => resolveToken(documents, path) as string;
const assertContrast = (foreground: string, background: string, minimum: number) => {
  const ratio = contrastRatio(color(foreground), color(background));
  expect(ratio, `${foreground} / ${background}: ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
    minimum,
  );
};

describe("token contrast", () => {
  it("meets content and focus thresholds", () => {
    assertContrast("color.foreground", "color.background", 7);
    assertContrast("color.mutedForeground", "color.background", 4.5);
    assertContrast("color.primaryForeground", "color.primary", 4.5);
    assertContrast("color.brandForeground", "color.brand", 4.5);
    assertContrast("color.focusRing", "color.background", 3);
  });

  it("keeps all category roles distinguishable", () => {
    const semantic = documents[1]!;
    const category = (semantic.color as Record<string, unknown>).category as object;
    for (const name of Object.keys(category)) {
      assertContrast(`color.category.${name}.foreground`, `color.category.${name}.solid`, 4.5);
      assertContrast(`color.category.${name}.solid`, `color.category.${name}.subtle`, 4.5);
      assertContrast(`color.category.${name}.border`, "color.background", 3);
    }
  });

  it("keeps status foreground readable", () => {
    for (const name of ["success", "warning", "info", "destructive"]) {
      assertContrast(`color.status.${name}.foreground`, `color.status.${name}.solid`, 4.5);
    }
  });
});
