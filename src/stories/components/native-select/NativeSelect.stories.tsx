import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { NativeSelect, NativeSelectOption } from "../../../components/native-select/index.js";

const meta = { title: "Components/NativeSelect", component: NativeSelect } satisfies Meta<
  typeof NativeSelect
>;
export default meta;
export const Selection: StoryObj<typeof meta> = {
  render: () => (
    <NativeSelect aria-label="Intensity" defaultValue="low">
      <NativeSelectOption value="low">Low</NativeSelectOption>
      <NativeSelectOption value="high">High</NativeSelectOption>
    </NativeSelect>
  ),
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole("combobox", { name: "Intensity" });
    await userEvent.selectOptions(control, "high");
    await expect(control).toHaveValue("high");
  },
};
