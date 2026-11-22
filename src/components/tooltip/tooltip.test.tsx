// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./index.js";
afterEach(cleanup);
it("shows a tooltip on keyboard focus", async () => {
  render(
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Today</TooltipTrigger>
        <TooltipContent>Go to today</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );
  act(() => screen.getByRole("button", { name: "Today" }).focus());
  expect(await screen.findByText("Go to today")).toBeVisible();
  expect(screen.getByRole("button", { name: "Today" })).toHaveFocus();
});
