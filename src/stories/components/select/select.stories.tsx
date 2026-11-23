import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../../../components/select/index.js";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../../components/dialog/index.js";
import { Button } from "../../../components/button/index.js";

const items = { low: "Low", high: "High", unavailable: "Unavailable" };

function Options() {
  return (
    <SelectContent alignItemWithTrigger={false}>
      <SelectGroup>
        <SelectLabel>Intensity</SelectLabel>
        <SelectItem value="low">Low</SelectItem>
        <SelectItem value="unavailable" disabled>
          Unavailable
        </SelectItem>
        <SelectSeparator />
        <SelectItem value="high">High</SelectItem>
      </SelectGroup>
    </SelectContent>
  );
}

function FormExample() {
  const [value, setValue] = React.useState<string | null>(null);
  const [invalid, setInvalid] = React.useState(false);
  const [submitted, setSubmitted] = React.useState("");
  return (
    <form
      aria-label="Preferences"
      className="grid max-w-sm gap-3 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (!data.get("intensity")) {
          setInvalid(true);
          return;
        }
        setSubmitted(JSON.stringify(Object.fromEntries(data)));
      }}
    >
      <Select
        name="intensity"
        value={value}
        items={items}
        onValueChange={(next) => {
          setValue(next);
          setInvalid(false);
        }}
      >
        <SelectTrigger
          aria-label="Intensity"
          aria-invalid={invalid}
          aria-describedby={invalid ? "intensity-error" : undefined}
        >
          <SelectValue placeholder="Choose intensity" />
        </SelectTrigger>
        <Options />
      </Select>
      {invalid && (
        <p id="intensity-error" role="alert">
          Choose an intensity.
        </p>
      )}
      <Select name="initial" defaultValue="low" items={items}>
        <SelectTrigger aria-label="Initial intensity">
          <SelectValue />
        </SelectTrigger>
        <Options />
      </Select>
      <Select name="disabled" defaultValue="high" items={items} disabled>
        <SelectTrigger aria-label="Disabled intensity">
          <SelectValue />
        </SelectTrigger>
        <Options />
      </Select>
      <Button type="submit">Save preferences</Button>
      <output aria-label="Submitted values">{submitted}</output>
    </form>
  );
}

const meta = { title: "Components/Select", component: Select } satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Form: Story = {
  render: () => <FormExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const form = canvas.getByRole<HTMLFormElement>("form", { name: "Preferences" });
    await expect(new FormData(form).get("initial")).toBe("low");
    await expect(new FormData(form).has("disabled")).toBe(false);
    await expect(new FormData(form).get("intensity")).toBe("");
    await expect(canvas.getByRole("combobox", { name: "Disabled intensity" })).toBeDisabled();
    await userEvent.click(canvas.getByRole("button", { name: "Save preferences" }));
    await expect(canvas.getByRole("alert")).toHaveTextContent("Choose an intensity.");
    const trigger = canvas.getByRole("combobox", { name: "Intensity" });
    await expect(trigger).toHaveAttribute("aria-invalid", "true");
    await userEvent.click(trigger);
    await userEvent.keyboard("{h}{Enter}");
    await waitFor(() => expect(trigger).toHaveTextContent("High"));
    await expect(new FormData(form).get("intensity")).toBe("high");
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("combobox", { name: "Initial intensity" }));
    await userEvent.click(await page.findByRole("option", { name: "High" }));
    await userEvent.click(canvas.getByRole("button", { name: "Save preferences" }));
    await expect(canvas.getByLabelText("Submitted values")).toHaveTextContent(
      '{"intensity":"high","initial":"high"}',
    );
  },
};

export const KeyboardAndEscape: Story = {
  render: () => (
    <Select defaultValue="low" items={items}>
      <SelectTrigger aria-label="Intensity">
        <SelectValue />
      </SelectTrigger>
      <Options />
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("combobox", { name: "Intensity" });
    const page = within(canvasElement.ownerDocument.body);
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(await page.findByRole("listbox")).toBeVisible();
    await userEvent.keyboard("{End}{Enter}");
    await waitFor(() => expect(trigger).toHaveTextContent("High"));
    await userEvent.click(trigger);
    await expect(await page.findByRole("listbox")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("listbox")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

export const InsideDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button />}>Open preferences</DialogTrigger>
      <DialogContent>
        <DialogTitle>Preferences</DialogTitle>
        <DialogDescription>Choose the preferred intensity.</DialogDescription>
        <FormExample />
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const opener = within(canvasElement).getByRole("button", { name: "Open preferences" });
    const overflowBefore = canvasElement.ownerDocument.body.style.overflow;
    await userEvent.click(opener);
    const dialog = await page.findByRole("dialog", { name: "Preferences" });
    const trigger = within(dialog).getByRole("combobox", { name: "Intensity" });
    await userEvent.click(trigger);
    await userEvent.click(await page.findByRole("option", { name: "High" }));
    await waitFor(() => expect(trigger).toHaveTextContent("High"));
    await userEvent.click(trigger);
    // Escape before the listbox opens belongs to the Dialog; wait until the Select owns it.
    await expect(await page.findByRole("listbox")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("listbox")).not.toBeInTheDocument());
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(opener).toHaveFocus();
    await waitFor(() =>
      expect(canvasElement.ownerDocument.body.style.overflow).toBe(overflowBefore),
    );
  },
};
