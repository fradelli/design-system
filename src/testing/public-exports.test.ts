import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const expected = [
  ".",
  "./alert",
  "./badge",
  "./button",
  "./card",
  "./cn",
  "./field",
  "./input",
  "./label",
  "./package.json",
  "./separator",
  "./sheet",
  "./skeleton",
  "./styles.css",
  "./switch",
];

describe("package exports", () => {
  it("publishes only the reviewed explicit subpaths", () => {
    const manifest = JSON.parse(readFileSync("package.json", "utf8")) as { exports: object };
    expect(Object.keys(manifest.exports).sort()).toEqual(expected);
  });
});
