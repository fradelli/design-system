import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/collapsible/index.js";
import { Button } from "../../../components/button/index.js";

const meta = { title: "Components/Collapsible", component: Collapsible } satisfies Meta<
  typeof Collapsible
>;
export default meta;
export const Keyboard: StoryObj<typeof meta> = {
  render: () => (
    <Collapsible>
      <CollapsibleTrigger render={<Button variant="ghost" />}>Details</CollapsibleTrigger>
      <CollapsibleContent>Additional information</CollapsibleContent>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Details" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByText("Additional information")).toBeVisible();
    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
};
