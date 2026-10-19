import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../../../components/input/index.js";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: { layout: "padded" },
  args: {},
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  parameters: { controls: { disable: false } },
  args: { "aria-label": "Display name", placeholder: "Your name" },
};
export const States: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <Input aria-label="Editable" placeholder="Editable" />
      <Input aria-label="Read only" readOnly value="Read only value" />
      <Input aria-label="Unavailable" disabled placeholder="Unavailable" />
      <Input aria-label="Invalid" aria-invalid="true" defaultValue="Review this value" />
    </div>
  ),
};
