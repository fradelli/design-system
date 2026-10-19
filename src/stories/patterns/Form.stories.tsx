import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/card/index.js";
import { Field, FieldDescription, FieldError, FieldLabel } from "../../components/field/index.js";
import { Input } from "../../components/input/index.js";
import { Skeleton } from "../../components/skeleton/index.js";
import { Separator } from "../../components/separator/index.js";

const meta = { title: "Patterns/Form", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Validation: Story = {
  render: () => (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Example form</CardTitle>
        <CardDescription>Labels and descriptions stay associated explicitly.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <Field data-invalid="true">
          <FieldLabel htmlFor="storybook-name">Display name</FieldLabel>
          <Input
            id="storybook-name"
            aria-describedby="storybook-name-help storybook-name-error"
            aria-invalid="true"
          />
          <FieldDescription id="storybook-name-help">Shown in shared examples.</FieldDescription>
          <FieldError id="storybook-name-error">A display name is required.</FieldError>
        </Field>
        <Separator />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  ),
};
