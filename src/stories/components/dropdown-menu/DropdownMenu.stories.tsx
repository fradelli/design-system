import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../../components/button/index.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../../components/dropdown-menu/index.js";

const meta = { title: "Components/DropdownMenu", component: DropdownMenu } satisfies Meta<
  typeof DropdownMenu
>;
export default meta;
export const Views: StoryObj<typeof meta> = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button />}>View</DropdownMenuTrigger>
      <DropdownMenuContent aria-label="View">
        <DropdownMenuRadioGroup defaultValue="week">
          <DropdownMenuRadioItem value="day">Day</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="week">Week</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "View" }));
    const menu = within(canvasElement.ownerDocument.body);
    await expect(await menu.findByRole("menuitemradio", { name: "Week" })).toBeChecked();
    await userEvent.keyboard("{Escape}");
  },
};

export const Shortcuts: StoryObj<typeof meta> = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button />}>Edit</DropdownMenuTrigger>
      <DropdownMenuContent aria-label="Edit">
        <DropdownMenuItem>
          Copy <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Paste <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Edit" }));
    const menu = within(canvasElement.ownerDocument.body);
    const copy = await menu.findByRole("menuitem", { name: /Copy/ });
    const paste = await menu.findByRole("menuitem", { name: /Paste/ });
    await userEvent.hover(copy);
    await waitFor(() => expect(copy).toHaveAttribute("data-highlighted"));
    const color = (element: Element) => getComputedStyle(element).color;
    const copyShortcut = within(copy).getByText("⌘C");
    const pasteShortcut = within(paste).getByText("⌘V");
    await waitFor(() => expect(color(copyShortcut)).toBe(color(copy)));
    await expect(color(pasteShortcut)).not.toBe(color(copyShortcut));
    await userEvent.keyboard("{Escape}");
  },
};
