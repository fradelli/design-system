import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Checkbox } from "../../../components/checkbox/index.js";

const meta = { title: "Components/Checkbox", component: Checkbox } satisfies Meta<typeof Checkbox>;
export default meta;
export const Keyboard: StoryObj<typeof meta> = {
  render: () => (
    <label>
      <Checkbox aria-labelledby="updates-label" /> <span id="updates-label">Receive updates</span>
    </label>
  ),
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole("checkbox", { name: "Receive updates" });
    control.focus();
    await userEvent.keyboard(" ");
    await expect(control).toBeChecked();
  },
};
