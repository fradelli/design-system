/** @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect, it } from "vitest";
import { Checkbox } from "./checkbox/index.js";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog/index.js";

it("opens the form, toggles the checkbox with Space and returns focus on Escape", async () => {
  const user = userEvent.setup();
  render(
    <Dialog>
      <DialogTrigger>Edit settings</DialogTrigger>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>
        <Checkbox aria-label="Reminders" />
      </DialogContent>
    </Dialog>,
  );
  const trigger = screen.getByRole("button", { name: "Edit settings" });
  await user.click(trigger);
  expect(screen.getByRole("dialog", { name: "Settings" })).toBeInTheDocument();
  const checkbox = screen.getByRole("checkbox", { name: "Reminders" });
  checkbox.focus();
  await user.keyboard(" ");
  expect(checkbox).toBeChecked();
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  await waitFor(() => expect(trigger).toHaveFocus());
});
