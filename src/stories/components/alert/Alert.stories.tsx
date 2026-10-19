import { expect } from "storybook/test";
import { XIcon } from "@phosphor-icons/react/X";
import { AlertAction } from "../../../components/alert/index.js";
import { Button } from "../../../components/button/index.js";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, AlertTitle, AlertDescription } from "../../../components/alert/index.js";

const meta = {
  title: "Components/Alert",
  component: Alert,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "info", "destructive"],
    },
  },
  parameters: { layout: "padded" },
  args: {},
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;
const variants = ["default", "success", "warning", "info", "destructive"] as const;
export const Variants: Story = {
  render: () => (
    <div className="grid max-w-xl gap-4">
      {variants.map((variant) => (
        <Alert key={variant} variant={variant}>
          <AlertTitle>{variant}</AlertTitle>
          <AlertDescription>
            A neutral, reusable message with enough content to validate wrapping on narrow screens.
          </AlertDescription>
        </Alert>
      ))}
    </div>
  ),
};

export const LayoutContracts: Story = {
  render: () => (
    <div className="grid w-full max-w-72 gap-4">
      {[false, true].flatMap((icon) =>
        variants.map((variant) => (
          <Alert key={`${icon}-${variant}`} variant={variant}>
            {icon ? <XIcon aria-hidden="true" /> : null}
            <AlertTitle>An important update with a heading that spans multiple lines</AlertTitle>
            <AlertDescription>
              A longer description to verify content separation on narrow screens.
            </AlertDescription>
            <AlertAction>
              <Button size="sm">View details</Button>
            </AlertAction>
          </Alert>
        )),
      )}
      <Alert>
        <AlertDescription>Description only</AlertDescription>
      </Alert>
      <Alert>
        <AlertTitle>Title only</AlertTitle>
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const alert of canvasElement.querySelectorAll('[data-slot="alert"]')) {
      const title = alert.querySelector('[data-slot="alert-title"]');
      const description = alert.querySelector('[data-slot="alert-description"]');
      const action = alert.querySelector('[data-slot="alert-action"]');
      if (title && description) {
        await expect(title.getBoundingClientRect().width).toBeGreaterThan(0);
        await expect(description.getBoundingClientRect().top).toBeGreaterThanOrEqual(
          title.getBoundingClientRect().bottom,
        );
      }
      if (action && description)
        await expect(action.getBoundingClientRect().top).toBeGreaterThanOrEqual(
          description.getBoundingClientRect().bottom,
        );
      await expect(alert.scrollWidth).toBeLessThanOrEqual(alert.clientWidth);
    }
  },
};
