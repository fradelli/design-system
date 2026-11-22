import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const expected = [
  ".",
  "./accordion",
  "./alert",
  "./alert-dialog",
  "./badge",
  "./button",
  "./card",
  "./checkbox",
  "./cn",
  "./collapsible",
  "./color-swatch",
  "./context-menu",
  "./dialog",
  "./dropdown-menu",
  "./field",
  "./icons",
  "./icons/*",
  "./input",
  "./item",
  "./kbd",
  "./label",
  "./loading-region",
  "./lucide-icons",
  "./native-select",
  "./navigation-item",
  "./package.json",
  "./pending-button",
  "./popover",
  "./progress",
  "./radio-group",
  "./select",
  "./separator",
  "./sheet",
  "./skeleton",
  "./status-badge",
  "./status-indicator",
  "./styles.css",
  "./switch",
  "./table",
  "./toast",
  "./tooltip",
];

describe("package exports", () => {
  it("publishes only the reviewed explicit subpaths", () => {
    const manifest = JSON.parse(readFileSync("package.json", "utf8")) as { exports: object };
    expect(Object.keys(manifest.exports).sort()).toEqual(expected);
  });
});
