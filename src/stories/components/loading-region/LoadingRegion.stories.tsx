import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingRegion } from "../../../components/loading-region/index.js";
import { Skeleton } from "../../../components/skeleton/index.js";

const meta = {
  title: "Components/LoadingRegion",
  component: LoadingRegion,
  parameters: { layout: "padded" },
  args: { label: "Loading content", children: null },
} satisfies Meta<typeof LoadingRegion>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Content: Story = {
  render: () => (
    <LoadingRegion label="Loading content" className="max-w-md">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-24 w-full" />
    </LoadingRegion>
  ),
};
