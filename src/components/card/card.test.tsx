/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Card, CardContent, CardHeader, CardTitle, cardVariants } from "./index.js";

afterEach(cleanup);

describe("Card surface contract", () => {
  it("defaults to glass without introducing interactive semantics", () => {
    render(
      <Card data-testid="card">
        <CardTitle>Summary</CardTitle>
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("DIV");
    expect(card).toHaveAttribute("data-surface", "glass");
    expect(card).toHaveClass("fd-surface-glass", "fd-card-default");
    expect(card).not.toHaveAttribute("surface");
    expect(card).not.toHaveAttribute("tabindex");
    expect(card).not.toHaveAttribute("role");
    expect(screen.getByText("Summary")).toHaveClass("fd-text-card");
  });

  it("owns padding at the root for both surfaces", () => {
    render(
      <Card surface="solid" size="sm" data-testid="card" className="border-status-info">
        <CardHeader data-testid="header">
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent data-testid="content">Content</CardContent>
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("data-surface", "solid");
    expect(card).toHaveClass("bg-surface", "fd-card-compact", "border-status-info");
    expect(card).not.toHaveClass("fd-surface-glass", "px-6");
    expect(screen.getByTestId("header")).not.toHaveClass("px-6");
    expect(screen.getByTestId("content")).not.toHaveClass("px-6");
  });

  it("normalizes nullable variants to the documented glass default", () => {
    render(<Card surface={null} data-testid="nullable" />);
    expect(screen.getByTestId("nullable")).toHaveClass("fd-surface-glass");
    expect(cardVariants()).toContain("fd-surface-glass");
  });
});
