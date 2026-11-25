import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { createToastManager, Toaster } from "../../../components/toast/index.js";
import { Button } from "../../../components/button/index.js";

const manager = createToastManager();

const meta = {
  title: "Components/Toast",
  component: Toaster,
  args: { closeLabel: "Dispensar notificação", toastManager: manager },
} satisfies Meta<typeof Toaster>;
export default meta;
export const Dismiss: StoryObj<typeof meta> = {
  render: (args) => (
    <Toaster {...args}>
      <Button onClick={() => manager.add({ title: "Alterações salvas", type: "success" })}>
        Show toast
      </Button>
    </Toaster>
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Show toast" }));
    await expect(await page.findByText("Alterações salvas")).toBeVisible();
    await userEvent.hover(page.getByRole("dialog", { name: "Alterações salvas" }));
    await userEvent.click(await page.findByRole("button", { name: "Dispensar notificação" }));
    await waitFor(() => expect(page.queryByText("Alterações salvas")).not.toBeInTheDocument());
  },
};
