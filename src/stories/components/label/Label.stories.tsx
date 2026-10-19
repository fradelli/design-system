import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../../../components/label/index.js";
import { Input } from "../../../components/input/index.js";

const meta = {
  title: "Components/Label",
  component: Label,
  parameters: { layout: "padded" },
  args: {},
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Multiline: Story = {
  render: () => (
    <div className="grid max-w-64 gap-2">
      <Label htmlFor="long-label">Full name used to identify you in shared information</Label>
      <Input id="long-label" />
    </div>
  ),
};
