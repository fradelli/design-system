import { XIcon } from "@phosphor-icons/react/X";
import type { Meta, StoryObj } from "@storybook/react-vite";
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
