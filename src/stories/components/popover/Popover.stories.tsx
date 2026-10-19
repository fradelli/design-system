import { expect, userEvent, within, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover } from "../../../components/popover/index.js";
import { Button } from "../../../components/button/index.js";

const meta = {
  title: "Components/Popover",
  component: Popover.Root,
  parameters: { layout: "padded" },
  args: { children: null },
} satisfies Meta<typeof Popover.Root>;
export default meta;
type Story = StoryObj<typeof meta>;
export const AccountActions: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="outline">Account actions</Button>
      </Popover.Trigger>
      <Popover.Content align="start" className="grid gap-3">
        <p className="text-sm font-medium">Manage your account</p>
        <Button variant="destructive">Sign out</Button>
      </Popover.Content>
    </Popover.Root>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-wrap gap-4">
      {(["top", "right", "bottom", "left"] as const).flatMap((side) =>
        (["start", "center", "end"] as const).map((align) => (
          <Popover.Root key={`${side}-${align}`}>
            <Popover.Trigger asChild>
              <Button variant="outline">
                {side} / {align}
              </Button>
            </Popover.Trigger>
            <Popover.Content side={side} align={align}>
              <p className="fd-text-label">Contextual information</p>
              <p>Supporting text wraps without leaving the viewport.</p>
            </Popover.Content>
          </Popover.Root>
        )),
      )}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    for (const trigger of canvas.getAllByRole("button")) {
      await userEvent.click(trigger);
      const panel = body.getByRole("dialog");
      await waitFor(async () => {
        const box = panel.getBoundingClientRect();
        await expect(box.left).toBeGreaterThanOrEqual(7.5);
        await expect(box.right).toBeLessThanOrEqual(doc.documentElement.clientWidth - 7.5);
      });
      await userEvent.keyboard("{Escape}");
      await expect(trigger).toHaveFocus();
    }
  },
};
export const LongContent: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button>Open long content</Button>
      </Popover.Trigger>
      <Popover.Content className="w-80">
        <p className="fd-text-label">Long content</p>
        {Array.from({ length: 20 }, (_, index) => (
          <p key={index}>
            Additional information that needs to remain accessible on a small screen.
          </p>
        ))}
      </Popover.Content>
    </Popover.Root>
  ),
};
