/** @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { BarbellIcon } from "../../icons/index.js";
import { NavigationItem } from "./index.js";

afterEach(cleanup);

describe("NavigationItem", () => {
  it("exposes the name and active state of an icon-only link", () => {
    render(
      <NavigationItem href="/example" aria-label="Example" aria-current="page">
        <BarbellIcon aria-hidden="true" />
      </NavigationItem>,
    );
    const link = screen.getByRole("link", { name: "Example" });
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveAttribute("href", "/example");
    expect(link).toHaveClass("min-h-11", "min-w-11");
  });

  it("composes a consumer link without nested anchors and remains keyboard focusable", async () => {
    const user = userEvent.setup();
    render(
      <NavigationItem asChild className="consumer-layout">
        <a href="/example">Example</a>
      </NavigationItem>,
    );
    expect(screen.getAllByRole("link")).toHaveLength(1);
    await user.tab();
    expect(screen.getByRole("link")).toHaveFocus();
    expect(screen.getByRole("link")).toHaveClass("consumer-layout");
    expect(screen.getByRole("link")).not.toHaveAttribute("aria-current");
  });
});
