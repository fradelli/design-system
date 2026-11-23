import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorSwatch } from "./index.js";

const meta = {
  title: "Components/ColorSwatch",
  component: ColorSwatch,
  args: { color: "purple", "aria-label": "Purple" },
} satisfies Meta<typeof ColorSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const BesideLabel: Story = {
  render: () => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--fd-space-2)" }}>
      <ColorSwatch color="sage" /> Sage
    </span>
  ),
};
