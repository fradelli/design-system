/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import type { FormEvent } from "react";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Alert, AlertDescription, AlertTitle } from "./alert/index.js";
import { Badge } from "./badge/index.js";
import { Button } from "./button/index.js";
import { Card, CardContent, CardTitle } from "./card/index.js";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field/index.js";
import { Input } from "./input/index.js";
import { Separator } from "./separator/index.js";
import { Skeleton } from "./skeleton/index.js";
import { Switch } from "./switch/index.js";

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

  it("exposes an accessible controlled switch", () => {
    const { rerender } = render(<Switch checked={false} aria-label="Enable reminders" />);

    expect(screen.getByRole("switch", { name: "Enable reminders" })).toHaveAttribute(
      "aria-checked",
      "false",
    );

    rerender(<Switch checked aria-label="Enable reminders" disabled />);

    const switchControl = screen.getByRole("switch", { name: "Enable reminders" });
    expect(switchControl).toHaveAttribute("aria-checked", "true");
    expect(switchControl).toBeDisabled();
  });

  it("supports keyboard activation without submitting a form by default", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    const { container } = render(
      <form onSubmit={onSubmit}>
        <Switch checked={false} aria-label="Enable reminders" onClick={onClick} />
      </form>,
    );

    const switchControl = within(container).getByRole("switch", { name: "Enable reminders" });
    expect(switchControl).toHaveAttribute("type", "button");
    switchControl.focus();
    expect(switchControl).toHaveFocus();
    await user.keyboard(" ");
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(switchControl).toHaveAttribute("aria-checked", "false");
  });

  it("does not activate when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(
      <Switch checked={false} aria-label="Unavailable option" disabled onClick={onClick} />,
    );

    await user.click(within(container).getByRole("switch", { name: "Unavailable option" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
