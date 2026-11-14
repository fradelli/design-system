import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../../../components/button/index.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
