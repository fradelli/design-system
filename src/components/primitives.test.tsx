/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Alert, AlertDescription, AlertTitle } from "./alert/index.js";
import { Badge } from "./badge/index.js";
import { Button } from "./button/index.js";
import { Card, CardContent, CardTitle } from "./card/index.js";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field/index.js";
import { Input } from "./input/index.js";
import { Separator } from "./separator/index.js";
import { Skeleton } from "./skeleton/index.js";

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
});
