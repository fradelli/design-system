import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { StatusIndicator } from "./index.js";

describe("StatusIndicator", () => {
  it("is decorative by default and does not create a live region", () => {
    const markup = renderToStaticMarkup(<StatusIndicator />);
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('data-pulse="false"');
    expect(markup).not.toContain("aria-live");
  });

  it("supports a labeled status and opt-in pulse without application state", () => {
    const markup = renderToStaticMarkup(
      <StatusIndicator tone="success" pulse aria-label="Active" />,
    );
    expect(markup).toContain('role="img"');
    expect(markup).toContain('aria-label="Active"');
    expect(markup).toContain('data-pulse="true"');
    expect(markup).not.toContain("aria-hidden");
  });

  it("explicitly stops the pulse for reduced motion", () => {
    const css = readFileSync("src/styles/styles.css", "utf8");
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.fd-status-indicator\[data-pulse="true"\]\s*\{\s*animation: none !important;/,
    );
  });
});
