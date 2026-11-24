import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "../../../components/context-menu/index.js";

const meta = { title: "Components/ContextMenu", component: ContextMenu } satisfies Meta<
  typeof ContextMenu
>;
export default meta;

export const Shortcuts: StoryObj<typeof meta> = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent aria-label="Actions">
        <ContextMenuItem>
          Rename <ContextMenuShortcut>F2</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Duplicate <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByText("Right-click here");
    await userEvent.pointer({ keys: "[MouseRight]", target: trigger });
    const menu = within(canvasElement.ownerDocument.body);
    const rename = await menu.findByRole("menuitem", { name: /Rename/ });
    const duplicate = await menu.findByRole("menuitem", { name: /Duplicate/ });
    await userEvent.hover(rename);
    await waitFor(() => expect(rename).toHaveAttribute("data-highlighted"));
    const color = (element: Element) => getComputedStyle(element).color;
    const renameShortcut = within(rename).getByText("F2");
    const duplicateShortcut = within(duplicate).getByText("⌘D");
    await waitFor(() => expect(color(renameShortcut)).toBe(color(rename)));
    await expect(color(duplicateShortcut)).not.toBe(color(renameShortcut));
    await userEvent.keyboard("{Escape}");
  },
};
