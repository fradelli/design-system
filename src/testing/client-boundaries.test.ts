import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const boundaries = new Map([
  ["src/components/label/index.tsx", true],
  ["src/components/separator/index.tsx", true],
  ["src/components/sheet/index.tsx", true],
  ["src/components/alert/index.tsx", false],
  ["src/components/badge/index.tsx", false],
  ["src/components/button/index.tsx", false],
  ["src/components/card/index.tsx", false],
  ["src/components/field/index.tsx", false],
  ["src/components/input/index.tsx", false],
  ["src/components/skeleton/index.tsx", false],
]);

describe("React client boundaries", () => {
  it("keeps use client limited to the reviewed Radix entrypoints", () => {
    for (const [file, expected] of boundaries) {
      const source = readFileSync(file, "utf8");
      expect(source.startsWith('"use client";'), file).toBe(expected);
    }
  });
});
