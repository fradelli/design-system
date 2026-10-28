import { XIcon } from "@phosphor-icons/react/X";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../../../components/button/index.js";

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "destructive", "ghost", "link"],
    },
  },
  parameters: { layout: "padded" },
  args: {},
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  parameters: { controls: { disable: false } },
  args: { children: "Save changes", variant: "default", size: "default" },
};
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(["default", "secondary", "outline", "destructive", "ghost", "link"] as const).map(
        (variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ),
      )}
      <Button disabled>Unavailable</Button>
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

export const IconSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(["icon-xs", "icon-sm", "icon", "icon-lg"] as const).map((size) => (
        <Button key={size} size={size} aria-label={`Close (${size})`}>
          <XIcon aria-hidden="true" />
        </Button>
      ))}
    </div>
  ),
};

export const InteractionStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>Primary action</Button>
      <Button disabled>Disabled action</Button>
      <Button asChild>
        <a href="#example">Link action</a>
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primary = canvas.getByRole("button", { name: "Primary action" });
    const disabled = canvas.getByRole("button", { name: "Disabled action" });
    const link = canvas.getByRole("link", { name: "Link action" });
    await expect(getComputedStyle(primary).cursor).toBe("pointer");
    await expect(getComputedStyle(link).cursor).toBe("pointer");
    await expect(getComputedStyle(disabled).cursor).toBe("default");
    await expect(getComputedStyle(disabled).pointerEvents).toBe("none");
    await expect(getComputedStyle(primary).opacity).toBe("1");
  },
};
