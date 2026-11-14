import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { StatusIndicator } from "../../../components/status-indicator/index.js";

const meta = {
  title: "Components/StatusIndicator",
  component: StatusIndicator,
} satisfies Meta<typeof StatusIndicator>;
export default meta;

export const Active: StoryObj<typeof meta> = {
  args: { tone: "success", pulse: true, "aria-label": "Active" },
  play: async ({ canvasElement }) => {
    const indicator = within(canvasElement).getByRole("img", { name: "Active" });
    await expect(indicator).toBeVisible();
    await expect(indicator).toHaveAttribute("data-pulse", "true");
  },
};

export const Static: StoryObj<typeof meta> = {
  args: { tone: "warning", "aria-label": "Paused" },
};
