// @vitest-environment jsdom
import * as React from "react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../dialog/index.js";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./index.js";

afterEach(cleanup);

function Control(props: React.ComponentProps<typeof Select<string>>) {
  return (
    <Select items={{ low: "Low", high: "High" }} {...props}>
      <SelectTrigger aria-label="Intensity">
        <SelectValue placeholder="Choose intensity" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

describe("Select form contract", () => {
  it("serializes the initial value and omits disabled fields", () => {
    const { container } = render(
      <form>
        <Control name="initial" defaultValue="low" />
        <Control name="disabled" defaultValue="high" disabled />
      </form>,
    );
    const data = new FormData(container.querySelector("form")!);
    expect(data.get("initial")).toBe("low");
    expect(data.has("disabled")).toBe(false);
    expect(screen.getAllByRole("combobox")[1]).toBeDisabled();
  });

  it("preserves empty serialization and displays a placeholder", () => {
    const { container } = render(
      <form>
        <Control name="intensity" />
      </form>,
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("Choose intensity");
    expect(new FormData(container.querySelector("form")!).get("intensity")).toBe("");
  });

  it("updates a controlled value and serializes the user selection", async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = React.useState<string | null>("low");
      return (
        <form>
          <Control name="intensity" value={value} onValueChange={setValue} />
        </form>
      );
    }
    const { container } = render(<Example />);
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    await user.click(await screen.findByRole("option", { name: "High" }));
    await waitFor(() => expect(trigger).toHaveTextContent("High"));
    expect(new FormData(container.querySelector("form")!).get("intensity")).toBe("high");
  });

  it("closes the popup with Escape and restores trigger focus", async () => {
    const user = userEvent.setup();
    render(<Control defaultValue="low" />);
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("removes conditional fields from FormData", () => {
    const { container, rerender } = render(
      <form>
        <Control name="conditional" defaultValue="low" />
      </form>,
    );
    expect(new FormData(container.querySelector("form")!).get("conditional")).toBe("low");
    rerender(<form />);
    expect(new FormData(container.querySelector("form")!).has("conditional")).toBe(false);
  });

  it("selects by keyboard without submitting the surrounding form", async () => {
    const user = userEvent.setup();
    let submissions = 0;
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submissions++;
        }}
      >
        <Control defaultValue="low" />
      </form>,
    );
    const trigger = screen.getByRole("combobox");
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    await screen.findByRole("listbox");
    await user.keyboard("{End}{Enter}");
    await waitFor(() => expect(trigger).toHaveTextContent("High"));
    expect(submissions).toBe(0);
  });

  it("closes only the Select layer before closing its parent Dialog", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open preferences</DialogTrigger>
        <DialogContent>
          <DialogTitle>Preferences</DialogTitle>
          <DialogDescription>Choose intensity.</DialogDescription>
          <Control defaultValue="low" />
        </DialogContent>
      </Dialog>,
    );
    const opener = screen.getByRole("button", { name: "Open preferences" });
    await user.click(opener);
    const trigger = await screen.findByRole("combobox");
    await user.click(trigger);
    await screen.findByRole("listbox");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    expect(screen.getByRole("dialog", { name: "Preferences" })).toBeInTheDocument();
    expect(trigger).toHaveFocus();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(opener).toHaveFocus();
  });
});
