import { XIcon } from "@phosphor-icons/react/X";
import { expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PendingButton } from "../../../components/pending-button/index.js";
import { useState } from "react";

const meta = {
  title: "Components/PendingButton",
  component: PendingButton,
  parameters: { layout: "padded" },
  args: { pending: true, pendingLabel: "Saving changes", children: "Save changes" },
} satisfies Meta<typeof PendingButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  parameters: { controls: { disable: false } },
  args: { children: "Save changes", pending: true, pendingLabel: "Saving changes" },
};
function InteractiveButton() {
  const [pending, setPending] = useState(false);
  return (
    <div className="grid justify-items-start gap-4">
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={pending}
          onChange={(event) => setPending(event.target.checked)}
        />
        Pending state
      </label>
      <PendingButton pending={pending} pendingLabel="Saving changes">
        Save
      </PendingButton>
    </div>
  );
}
export const Interactive: Story = { render: () => <InteractiveButton /> };
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <PendingButton key={size} size={size} pending pendingLabel="Saving changes">
          Save
        </PendingButton>
      ))}
    </div>
  ),
};

Sizes.play = async ({ canvasElement }) => {
  for (const button of canvasElement.querySelectorAll<HTMLElement>(
    'button[data-slot="pending-button"]',
  )) {
    const content =
      button.querySelector('span[aria-hidden]:not([aria-hidden="true"])') ??
      button.querySelector("span > span:last-child");
    const rect = button.getBoundingClientRect();
    const style = getComputedStyle(button);
    const inner = content!.getBoundingClientRect();
    await expect(inner.left).toBeGreaterThanOrEqual(rect.left + parseFloat(style.paddingLeft) - 1);
    await expect(inner.right).toBeLessThanOrEqual(rect.right - parseFloat(style.paddingRight) + 1);
  }
};
Interactive.play = async ({ canvasElement }) => {
  const checkbox = canvasElement.querySelector("input")!;
  const button = canvasElement.querySelector("button")!;
  const width = button.getBoundingClientRect().width;
  checkbox.click();
  await expect(button).toHaveAccessibleName("Saving changes");
  await expect(button.getBoundingClientRect().width).toBe(width);
};

export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(["icon-xs", "icon-sm", "icon", "icon-lg"] as const).map((size) => (
        <PendingButton
          key={size}
          size={size}
          pending
          pendingLabel={`Saving (${size})`}
          aria-label="Save"
        >
          <XIcon aria-hidden="true" />
        </PendingButton>
      ))}
    </div>
  ),
};
