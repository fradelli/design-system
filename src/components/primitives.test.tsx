/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Alert, AlertDescription, AlertTitle } from "./alert/index.js";
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
} from "./alert-dialog/index.js";
import { Badge } from "./badge/index.js";
import { Button } from "./button/index.js";
import { Card, CardContent, CardTitle } from "./card/index.js";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field/index.js";
import { Input } from "./input/index.js";
import { LoadingRegion } from "./loading-region/index.js";
import { PendingButton } from "./pending-button/index.js";
import { Separator } from "./separator/index.js";
import { Skeleton } from "./skeleton/index.js";
import { StatusBadge } from "./status-badge/index.js";

describe("shared primitives", () => {
  it("composes accessible form and feedback primitives", () => {
    render(
      <div>
        <Field data-invalid="true">
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" aria-describedby="email-description email-error" aria-invalid="true" />
          <FieldDescription id="email-description">Account contact.</FieldDescription>
          <FieldError
            id="email-error"
            errors={[{ message: "Required" }, { message: "Required" }]}
          />
        </Field>
        <Alert role="status" variant="success">
          <AlertTitle>Saved</AlertTitle>
          <AlertDescription>Changes are available.</AlertDescription>
        </Alert>
      </div>,
    );

    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAccessibleDescription(
      "Account contact. Required",
    );
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
    expect(screen.getAllByText("Required")).toHaveLength(1);
  });

  it("preserves native behavior, composition and visual states", () => {
    render(
      <Card size="sm">
        <CardTitle>Example</CardTitle>
        <CardContent>
          <Badge asChild variant="info">
            <a href="#details">Details</a>
          </Badge>
          <Button disabled>Save</Button>
          <Separator />
          <Skeleton data-testid="skeleton" />
        </CardContent>
      </Card>,
    );

    expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute("data-slot", "badge");
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(screen.getByTestId("skeleton")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("skeleton")).toHaveClass("motion-reduce:animate-none");
  });

  it("announces loading, pending and status feedback without domain semantics", () => {
    render(
      <LoadingRegion label="Loading profile">
        <PendingButton pending pendingLabel="Saving">
          Save
        </PendingButton>
        <StatusBadge label="Available" tone="success" />
      </LoadingRegion>,
    );

    expect(screen.getByRole("region", { name: "Loading profile" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getByText("Loading profile", { selector: "[role=status]" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Saving" })).toBeDisabled();
    expect(screen.getByText("Available")).toHaveAttribute("data-slot", "status-badge");
  });

  it("requires an explicit confirmation and returns focus to its trigger", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>Remove item</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove item?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
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
      </AlertDialog>,
    );

    const trigger = screen.getByRole("button", { name: "Remove item" });
    await user.click(trigger);
    expect(await screen.findByRole("alertdialog", { name: "Remove item?" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
