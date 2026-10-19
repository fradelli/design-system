import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBadge } from "../../../components/status-badge/index.js";

const meta = {
  title: "Components/StatusBadge",
  component: StatusBadge,
  parameters: { layout: "padded" },
  args: { label: "Available" },
} satisfies Meta<typeof StatusBadge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(["neutral", "success", "warning", "info", "destructive"] as const).map((tone) => (
        <StatusBadge key={tone} tone={tone} label={tone} />
      ))}
    </div>
  ),
};
