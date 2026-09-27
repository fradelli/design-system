import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavigationItem } from "../../components/navigation-item/index.js";
import { BarbellIcon, ForkKnifeIcon } from "../../icons/index.js";

const meta = {
  title: "Components/NavigationItem",
  component: NavigationItem,
  parameters: { layout: "padded" },
} satisfies Meta<typeof NavigationItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TextLinks: Story = {
  render: () => (
    <nav aria-label="Example navigation" className="flex gap-2">
      <NavigationItem href="#first" aria-current="page">
        First
      </NavigationItem>
      <NavigationItem href="#second">Second</NavigationItem>
    </nav>
  ),
};

export const IconLinks: Story = {
  render: () => (
    <nav aria-label="Example icon navigation" className="flex gap-2">
      <NavigationItem href="#first" aria-label="First" aria-current="page">
        <BarbellIcon aria-hidden="true" />
      </NavigationItem>
      <NavigationItem href="#second" aria-label="Second">
        <ForkKnifeIcon aria-hidden="true" />
      </NavigationItem>
    </nav>
  ),
};
