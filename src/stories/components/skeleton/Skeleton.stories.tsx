import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "../../../components/skeleton/index.js";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  parameters: { layout: "padded" },
  args: {},
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Shapes: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <Skeleton className="size-12 rounded-full" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-32 w-full" />
    </div>
  ),
};
