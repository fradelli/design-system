import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../../components/dialog/index.js";
import { Button } from "../../../components/button/index.js";

const meta = { title: "Components/Dialog", component: Dialog } satisfies Meta<typeof Dialog>;
export default meta;
export const Keyboard: StoryObj<typeof meta> = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button />}>Open details</DialogTrigger>
      <DialogContent>
        <DialogTitle>Details</DialogTitle>
        <DialogDescription>Account settings</DialogDescription>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Open details" });
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(trigger);
    await expect(await page.findByRole("dialog", { name: "Details" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
