import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { Progress, ProgressLabel, ProgressValue } from "../../../components/progress/index.js";

const meta = {
  title: "Components/Progress",
  component: Progress,
  parameters: { layout: "padded" },
  args: { value: 64 },
} satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithLabel: Story = {
  render: (args) => (
    <Progress {...args} className="max-w-sm">
      <ProgressLabel>Completed</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
  play: async ({ canvasElement }) => {
    const progress = within(canvasElement).getByRole("progressbar", { name: "Completed" });
    await expect(progress).toHaveAttribute("aria-valuenow", "64");
  },
};

export const Compact: Story = {
  args: { value: 30, "aria-label": "Sync progress", className: "max-w-sm" },
};

export const Indeterminate: Story = {
  args: { value: null, "aria-label": "Loading", className: "max-w-sm" },
};
