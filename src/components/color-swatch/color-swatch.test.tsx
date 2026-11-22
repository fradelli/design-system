import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ColorSwatch } from "./index.js";

describe("ColorSwatch", () => {
  it("is decorative beside an existing color label", () => {
    const html = renderToStaticMarkup(<ColorSwatch color="purple" />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("var(--fd-color-category-purple-solid)");
    expect(html).not.toContain('role="img"');
  });

  it("exposes an accessible name when displayed on its own", () => {
    const html = renderToStaticMarkup(<ColorSwatch color="sage" aria-label="Sage" />);
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Sage"');
    expect(html).not.toContain("aria-hidden");
    expect(html).toContain("var(--fd-primitive-color-sage-400)");
  });

  it("defaults to the neutral palette sample", () => {
    expect(renderToStaticMarkup(<ColorSwatch />)).toContain("var(--fd-color-muted-foreground)");
  });
});
