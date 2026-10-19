import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "../../../components/radio-group/index.js";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup.Root,
  parameters: { layout: "padded" },
  args: {},
} satisfies Meta<typeof RadioGroup.Root>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Selection: Story = {
  render: () => (
    <RadioGroup.Root aria-label="Preferred layout" defaultValue="north" className="grid gap-2">
      <RadioGroup.Item value="north">Comfortable</RadioGroup.Item>
      <RadioGroup.Item value="south">Compact</RadioGroup.Item>
    </RadioGroup.Root>
  ),
};

export const Unselected: Story = {
  render: () => (
    <RadioGroup.Root aria-label="Preferred density">
      <RadioGroup.Item value="unavailable" disabled>
        Unavailable
      </RadioGroup.Item>
      <RadioGroup.Item value="comfortable">Comfortable</RadioGroup.Item>
      <RadioGroup.Item value="compact">
        Compact<RadioGroup.Indicator> — Selected</RadioGroup.Indicator>
      </RadioGroup.Item>
    </RadioGroup.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radios = canvas.getAllByRole("radio");
    await expect(radios.filter((radio) => radio.tabIndex === 0)).toHaveLength(1);
    await userEvent.tab();
    await expect(radios[1]).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(radios[2]).toHaveFocus();
    await expect(radios[2]).toHaveAttribute("aria-checked", "true");
  },
};

export const RequiredForm: Story = {
  render: () => (
    <form aria-label="Density preference" onSubmit={(event) => event.preventDefault()}>
      <RadioGroup.Root aria-label="Required density" name="density" required>
        <RadioGroup.Item value="unavailable" disabled>
          Unavailable
        </RadioGroup.Item>
        <RadioGroup.Item value="comfortable">Comfortable</RadioGroup.Item>
        <RadioGroup.Item value="compact">Compact</RadioGroup.Item>
      </RadioGroup.Root>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const form = canvasElement.querySelector("form")!;
    await expect(form.checkValidity()).toBe(false);
    await expect(form.reportValidity()).toBe(false);
    await expect(canvas.getByRole("radio", { name: "Comfortable" })).toHaveFocus();
    await userEvent.click(canvas.getByRole("radio", { name: "Compact" }));
    await expect(form.checkValidity()).toBe(true);
    await expect(new FormData(form).getAll("density")).toEqual(["compact"]);
  },
};
