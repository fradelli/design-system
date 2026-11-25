// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { createToastManager, ToastClose, Toaster } from "./index.js";

afterEach(cleanup);

it("announces the message and uses the consumer's dismiss label", async () => {
  const manager = createToastManager();
  render(<Toaster toastManager={manager} closeLabel="Dismiss notification" />);
  act(() => {
    manager.add({ title: "Could not save", type: "error" });
  });
  expect(await screen.findByText("Could not save")).toBeVisible();
  fireEvent.focus(screen.getByRole("region", { name: "Notifications" }));
  fireEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
  await waitFor(() => expect(screen.queryByText("Could not save")).not.toBeInTheDocument());
});

it("requires the consumer's close label", () => {
  // @ts-expect-error `Toaster` needs `closeLabel`.
  const missingToasterLabel = <Toaster />;
  // @ts-expect-error `ToastClose` needs `aria-label`.
  const missingCloseLabel = <ToastClose />;
  expect([missingToasterLabel, missingCloseLabel]).toHaveLength(2);
});
