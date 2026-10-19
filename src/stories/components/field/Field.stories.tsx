import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldGroup,
  FieldContent,
  FieldTitle,
  FieldSeparator,
} from "../../../components/field/index.js";
import { Input } from "../../../components/input/index.js";

const meta = {
  title: "Components/Field",
  component: Field,
  parameters: { layout: "padded" },
  args: {},
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Form: Story = {
  render: () => (
    <FieldSet className="max-w-md">
      <FieldLegend>Contact details</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="field-name">Name</FieldLabel>
          <Input id="field-name" aria-describedby="field-help" />
          <FieldDescription id="field-help">Shown in shared examples.</FieldDescription>
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field data-invalid="true">
          <FieldLabel htmlFor="field-email">Email</FieldLabel>
          <Input id="field-email" aria-invalid="true" aria-describedby="field-error" />
          <FieldError id="field-error">Enter a valid email.</FieldError>
        </Field>
        <Field orientation="horizontal">
          <input type="checkbox" id="field-opt" />
          <FieldContent>
            <FieldLabel htmlFor="field-opt">Receive updates</FieldLabel>
            <FieldTitle>Optional preference</FieldTitle>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="field-disabled">Unavailable</FieldLabel>
          <Input id="field-disabled" disabled />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

export const Orientations: Story = {
  render: () => (
    <div className="grid w-full max-w-72 gap-6">
      {(["vertical", "horizontal", "responsive"] as const).map((orientation) => (
        <Field key={orientation} orientation={orientation}>
          <FieldLabel htmlFor={`orientation-${orientation}`}>
            {orientation} label with multiple lines
          </FieldLabel>
          <FieldContent>
            <Input
              id={`orientation-${orientation}`}
              aria-describedby={`description-${orientation}`}
            />
            <FieldDescription id={`description-${orientation}`}>
              Supporting information stays readable.
            </FieldDescription>
          </FieldContent>
        </Field>
      ))}
    </div>
  ),
};
