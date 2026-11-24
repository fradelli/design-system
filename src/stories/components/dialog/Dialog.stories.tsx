import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/dialog/index.js";
import { Button } from "../../../components/button/index.js";

const meta = { title: "Components/Dialog", component: Dialog } satisfies Meta<typeof Dialog>;
export default meta;
export const Keyboard: StoryObj<typeof meta> = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button />}>Open details</DialogTrigger>
      <DialogContent closeLabel="Close details">
        <DialogTitle>Details</DialogTitle>
        <DialogDescription>Account settings</DialogDescription>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Open details" });
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(trigger);
    const dialog = await page.findByRole("dialog", { name: "Details" });
    await expect(dialog).toBeVisible();
    await expect(within(dialog).getByRole("button", { name: "Close details" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const FooterClose: StoryObj<typeof meta> = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button />}>Open summary</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogTitle>Resumo</DialogTitle>
        <DialogDescription>Os rótulos de fechar vêm do aplicativo.</DialogDescription>
        <DialogFooter showCloseButton closeLabel="Fechar" />
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Open summary" });
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(trigger);
    const dialog = await page.findByRole("dialog", { name: "Resumo" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Fechar" }));
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
