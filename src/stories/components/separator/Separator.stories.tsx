import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "../../../components/separator/index.js";

const meta = {
  title: "Components/Separator",
  component: Separator,
  parameters: { layout: "padded" },
  args: {},
} satisfies Meta<typeof Separator>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Orientations: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <p>Horizontal separator</p>
      <Separator />
      <div className="flex h-12 items-center gap-4">
        <span>First</span>
        <Separator orientation="vertical" />
        <span>Second</span>
      </div>
      <Separator decorative={false} />
    </div>
  ),
};
