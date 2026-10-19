import { expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../../components/badge/index.js";
import { Button } from "../../../components/button/index.js";

const meta = {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "success",
        "warning",
        "info",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
    },
  },
  parameters: { layout: "padded" },
  args: {},
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(
        [
          "default",
          "secondary",
          "success",
          "warning",
          "info",
          "destructive",
          "outline",
          "ghost",
          "link",
        ] as const
      ).map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};
export const MixedHeight: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button>Action</Button>
      <Badge>Natural height</Badge>
    </div>
  ),
};
export const LongLabel: Story = {
  render: () => (
    <div className="w-full max-w-48">
      <Badge variant="info">Additional information with a longer descriptive label</Badge>
    </div>
  ),
};

MixedHeight.play = async ({ canvasElement }) => {
  const badge = canvasElement.querySelector('[data-slot="badge"]')!;
  const button = canvasElement.querySelector('[data-slot="button"]')!;
  await expect(badge.getBoundingClientRect().height).toBeLessThan(
    button.getBoundingClientRect().height,
  );
};
LongLabel.play = async ({ canvasElement }) => {
  const badge = canvasElement.querySelector('[data-slot="badge"]')!;
  await expect(badge.scrollWidth).toBeLessThanOrEqual(badge.clientWidth);
};
