import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const expected = [
  ".",
  "./alert",
  "./alert-dialog",
  "./badge",
  "./button",
  "./card",
  "./cn",
  "./field",
  "./input",
  "./label",
  "./loading-region",
  "./package.json",
  "./pending-button",
  "./separator",
  "./sheet",
  "./skeleton",
  "./status-badge",
  "./styles.css",
];

describe("package exports", () => {
  it("publishes only the reviewed explicit subpaths", () => {
    const manifest = JSON.parse(readFileSync("package.json", "utf8")) as { exports: object };
    expect(Object.keys(manifest.exports).sort()).toEqual(expected);
  });
});
