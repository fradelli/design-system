import { expect, userEvent, within, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../../../components/sheet/index.js";
import { Button } from "../../../components/button/index.js";
import { Input } from "../../../components/input/index.js";

const meta = {
  title: "Components/Sheet",
  component: Sheet,
  parameters: { layout: "padded" },
  args: { children: null },
} satisfies Meta<typeof Sheet>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open panel</Button>
      </SheetTrigger>
      <SheetContent closeLabel="Close panel">
        <SheetTitle>Example panel</SheetTitle>
        <SheetDescription>Keyboard focus remains inside this modal panel.</SheetDescription>
        <Input aria-label="Panel value" />
      </SheetContent>
    </Sheet>
  ),
};

function Panel({ side }: { side: "left" | "right" | "top" | "bottom" }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open {side}</Button>
      </SheetTrigger>
      <SheetContent side={side} closeLabel={`Close ${side}`}>
        <SheetTitle>Example {side} panel with a longer title</SheetTitle>
        <SheetDescription>
          Content remains reachable and the close action has its own space.
        </SheetDescription>
        <Input aria-label={`${side} value`} />
      </SheetContent>
    </Sheet>
  );
}
export const Sides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["left", "right", "top", "bottom"] as const).map((side) => (
        <Panel key={side} side={side} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;
    for (const side of ["left", "right", "top", "bottom"]) {
      const panel = canvasElement.querySelector<HTMLDialogElement>(`[data-side="${side}"]`)!;
      await expect(getComputedStyle(panel).display).toBe("none");
      const trigger = canvas.getByRole("button", { name: `Open ${side}` });
      await userEvent.click(trigger);
      await waitFor(async () => {
        const box = panel.getBoundingClientRect();
        const viewport = doc.documentElement;
        const edge =
          side === "left"
            ? box.left
            : side === "right"
              ? viewport.clientWidth - box.right
              : side === "top"
                ? box.top
                : viewport.clientHeight - box.bottom;
        await expect(Math.abs(edge)).toBeLessThan(1);
      });
      await userEvent.click(canvas.getByRole("button", { name: `Close ${side}` }));
      await expect(getComputedStyle(panel).display).toBe("none");
      await expect(trigger).toHaveFocus();
    }
  },
};
