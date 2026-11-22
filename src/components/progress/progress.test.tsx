// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";

import { Progress, ProgressLabel, ProgressValue } from "./index.js";

afterEach(cleanup);

it("exposes the progress value with its visible label", () => {
  render(
    <Progress value={40}>
      <ProgressLabel>Upload</ProgressLabel>
      <ProgressValue />
    </Progress>,
  );

  const progress = screen.getByRole("progressbar", { name: "Upload" });
  expect(progress).toHaveAttribute("aria-valuenow", "40");
  expect(progress).toHaveAttribute("data-slot", "progress");
  expect(screen.getByText("40%")).toHaveAttribute("data-slot", "progress-value");
});

it("accepts an accessible name without a visible label", () => {
  render(<Progress value={75} aria-label="Completed tasks" />);

  expect(screen.getByRole("progressbar", { name: "Completed tasks" })).toHaveAttribute(
    "aria-valuenow",
    "75",
  );
});

it("renders the Mira track and indicator inside the root", () => {
  const { container } = render(<Progress value={20} aria-label="Sync" className="w-40" />);

  expect(screen.getByRole("progressbar", { name: "Sync" })).toHaveClass("w-40");
  expect(container.querySelector('[data-slot="progress-track"]')).toHaveClass(
    "h-1",
    "rounded-md",
    "bg-surface-interactive",
  );
  expect(container.querySelector('[data-slot="progress-indicator"]')).toHaveClass(
    "h-full",
    "bg-primary",
  );
});
