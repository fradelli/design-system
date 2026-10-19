import { expect, userEvent, within, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "../../../components/switch/index.js";
import { useState } from "react";

const meta = {
  title: "Components/Switch",
  component: Switch,
  parameters: { layout: "padded" },
  args: { checked: false, "aria-label": "Notifications" },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
function SwitchExample() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-6">
      <label className="flex items-center gap-2 text-sm">
        <Switch
          checked={checked}
          aria-label="Notifications"
          onClick={() => setChecked((value) => !value)}
        />
        {checked ? "On" : "Off"}
      </label>
      <Switch checked aria-label="Disabled on" disabled />
      <Switch checked={false} aria-label="Disabled off" disabled />
    </div>
  );
}
export const Playground: Story = {
  parameters: { controls: { disable: false } },
  args: { checked: false, "aria-label": "Notifications" },
};
export const Interactive: Story = { render: () => <SwitchExample /> };

Interactive.play = async ({ canvasElement }) => {
  const control = within(canvasElement).getByRole("switch", { name: "Notifications" });
  const off = getComputedStyle(control).backgroundColor;
  await userEvent.click(control);
  await expect(control).toHaveAttribute("aria-checked", "true");
  await waitFor(() => expect(getComputedStyle(control).backgroundColor).not.toBe(off));
};
