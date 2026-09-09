/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Button } from "../button/index.js";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./index.js";

describe("Sheet", () => {
  it("opens by keyboard, closes with Escape and returns focus", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open panel</Button>
        </SheetTrigger>
        <SheetContent closeLabel="Close panel">
          <SheetTitle>Preferences</SheetTitle>
          <SheetDescription>Choose shared visual preferences.</SheetDescription>
          <input aria-label="Display name" />
        </SheetContent>
      </Sheet>,
    );

    const trigger = screen.getByRole("button", { name: "Open panel" });
    trigger.focus();
    await user.keyboard("{Enter}");
    const dialog = await screen.findByRole("dialog", { name: "Preferences" });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    expect(screen.getByRole("button", { name: "Close panel" })).toBeVisible();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
