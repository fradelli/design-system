import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../../components/button/index.js";
import { TrashIcon } from "../../icons/generated/Trash.js";
import { PlusIcon } from "../../icons/generated/Plus.js";
import { PencilSimpleIcon } from "../../icons/generated/PencilSimple.js";
import { XIcon } from "../../icons/generated/X.js";
import type { IconProps } from "../../icons/icon.types.js";

const meta = { title: "Foundations/Icons", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Actions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button aria-label="Add item" size="icon" className="min-h-11 min-w-11 [&>svg]:size-5">
        <PlusIcon weight="regular" aria-hidden="true" focusable="false" />
      </Button>
      <Button
        aria-label="Edit item"
        variant="outline"
        size="icon"
        className="min-h-11 min-w-11 [&>svg]:size-5"
      >
        <PencilSimpleIcon weight="regular" aria-hidden="true" focusable="false" />
      </Button>
      <Button
        aria-label="Delete item"
        variant="ghost"
        size="icon"
        className="min-h-11 min-w-11 text-status-destructive [&>svg]:size-5"
      >
        <TrashIcon weight="regular" aria-hidden="true" focusable="false" />
      </Button>
      <Button
        aria-label="Close"
        variant="ghost"
        size="icon"
        className="min-h-11 min-w-11 [&>svg]:size-5"
      >
        <XIcon weight="regular" aria-hidden="true" focusable="false" />
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const name of ["Add item", "Edit item", "Delete item", "Close"]) {
      const button = canvas.getByRole("button", { name });
      const icon = button.querySelector("svg");
      await expect(icon).toHaveAttribute("aria-hidden", "true");
      await expect(icon).toHaveAttribute("focusable", "false");
      await expect(button.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
      await expect(icon?.getBoundingClientRect().width).toBe(20);
    }
  },
};

const weights: NonNullable<IconProps["weight"]>[] = [
  "thin",
  "light",
  "regular",
  "bold",
  "fill",
  "duotone",
];
export const WeightsAndSizes: Story = {
  render: () => (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end gap-6">
        {weights.map((weight) => (
          <div key={weight}>
            <TrashIcon weight={weight} size={32} aria-hidden="true" />
            <p>{weight}</p>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-6">
        {[16, 20, 24].map((size) => (
          <div key={size}>
            <PlusIcon size={size} weight="regular" aria-hidden="true" />
            <p>{size}px</p>
          </div>
        ))}
      </div>
      <p>
        Import one public icon module at a time; the full catalog is available without a runtime
        registry.
      </p>
    </div>
  ),
};
