import { expect, userEvent, within, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/alert-dialog/index.js";
import { Button } from "../../../components/button/index.js";

const meta = {
  title: "Components/AlertDialog",
  component: AlertDialog,
  parameters: { layout: "padded" },
  args: { children: null },
} satisfies Meta<typeof AlertDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Confirmation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Remove item</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove item?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive">Remove</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

Confirmation.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const trigger = canvas.getByRole("button", { name: "Remove item" });
  await userEvent.click(trigger);
  const panel = canvas.getByRole("alertdialog");
  const header = panel.querySelector('[data-slot="alert-dialog-header"]')!;
  const footer = panel.querySelector('[data-slot="alert-dialog-footer"]')!;
  await waitFor(() =>
    expect(
      footer.getBoundingClientRect().top - header.getBoundingClientRect().bottom,
    ).toBeGreaterThanOrEqual(15.99),
  );
  await expect(canvas.getByRole("button", { name: "Cancel" })).toHaveFocus();
  await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
  await expect(getComputedStyle(panel).display).toBe("none");
  await expect(trigger).toHaveFocus();
};
