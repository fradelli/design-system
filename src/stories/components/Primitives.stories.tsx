import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alert, AlertDescription, AlertTitle } from "../../components/alert/index.js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/alert-dialog/index.js";
import { Badge } from "../../components/badge/index.js";
import { Button } from "../../components/button/index.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/card/index.js";
import { Field, FieldDescription, FieldError, FieldLabel } from "../../components/field/index.js";
import { Input } from "../../components/input/index.js";
import { LoadingRegion } from "../../components/loading-region/index.js";
import { PendingButton } from "../../components/pending-button/index.js";
import { Separator } from "../../components/separator/index.js";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../../components/sheet/index.js";
import { Skeleton } from "../../components/skeleton/index.js";
import { StatusBadge } from "../../components/status-badge/index.js";

const meta = { title: "Components/Primitives", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const variants = ["default", "success", "warning", "info", "destructive"] as const;

export const Feedback: Story = {
  render: () => (
    <div className="grid max-w-xl gap-4">
      {variants.map((variant) => (
        <Alert key={variant} variant={variant}>
          <AlertTitle>{variant}</AlertTitle>
          <AlertDescription>
            A neutral, reusable message with enough content to validate wrapping on narrow screens.
          </AlertDescription>
        </Alert>
      ))}
    </div>
  ),
};

export const Actions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>Save changes</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Remove</Button>
      <Button disabled>Loading…</Button>
      <Badge>Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Information</Badge>
    </div>
  ),
};

export const Form: Story = {
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

export const Overlay: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open panel</Button>
      </SheetTrigger>
      <SheetContent closeLabel="Close panel">
        <SheetTitle>Example panel</SheetTitle>
        <SheetDescription>Keyboard focus remains inside this modal panel.</SheetDescription>
        <Input aria-label="Panel value" />
      </SheetContent>
    </Sheet>
  ),
};

export const AsyncFeedback: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <LoadingRegion label="Loading content">
        <Skeleton className="h-20 w-full" />
      </LoadingRegion>
      <div className="flex flex-wrap items-center gap-3">
        <PendingButton pending pendingLabel="Saving changes">
          Save changes
        </PendingButton>
        <StatusBadge label="Available" tone="success" />
      </div>
    </div>
  ),
};

export const Confirmation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Remove item</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove item?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive">Remove</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
