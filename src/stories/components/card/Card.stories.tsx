import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Badge } from "../../../components/badge/index.js";
import { Button } from "../../../components/button/index.js";
import {
  Card,
  CardContent,
  CardAction,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/card/index.js";
import { Field, FieldError, FieldLabel } from "../../../components/field/index.js";
import { Input } from "../../../components/input/index.js";

const meta = {
  title: "Components/Card",
  component: Card,
  args: { surface: "glass", size: "default" },
  argTypes: {
    surface: { control: "inline-radio", options: ["glass", "solid"] },
    size: { control: "inline-radio", options: ["default", "sm"] },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Surfaces: Story = {
  render: () => (
    <main className="grid max-w-5xl gap-6">
      <h1 className="fd-text-section">Card surfaces</h1>
      <p className="fd-text-body">The same palette and typography across independent products.</p>
      <div className="grid gap-6 rounded-xl bg-[radial-gradient(ellipse_at_top_left,#7da7f2,transparent_65%)] p-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Glass</CardTitle>
            <CardDescription>A subtle material on a colored background.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Badge variant="info">Information</Badge>
            <Button>Continue</Button>
          </CardContent>
        </Card>
        <Card surface="solid">
          <CardHeader>
            <CardTitle>Solid</CardTitle>
            <CardDescription>Predictable contrast for dense content.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary">Details</Button>
          </CardContent>
        </Card>
      </div>
      <section className="rounded-xl bg-white p-6" aria-label="Elevated surface on bright artwork">
        <div className="fd-surface-glass-elevated grid gap-4 rounded-xl border p-6">
          <h2 className="fd-text-card">Elevated</h2>
          <p className="text-muted-foreground">
            Use a more opaque surface when the background requires it.
          </p>
        </div>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>One blur boundary</CardTitle>
        </CardHeader>
        <CardContent>
          <Card surface="solid" size="sm">
            <CardContent>Nested content remains opaque.</CardContent>
          </Card>
        </CardContent>
      </Card>
    </main>
  ),
};

export const CompiledStyles: Story = {
  render: () => (
    <Card data-testid="glass-card" className="max-w-lg">
      <CardHeader>
        <CardTitle>Shared title</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field data-invalid="true">
          <FieldLabel htmlFor="glass-name">Name</FieldLabel>
          <Input id="glass-name" aria-invalid="true" aria-describedby="glass-name-error" />
          <FieldError id="glass-name-error">A name is required.</FieldError>
        </Field>
        <Card data-testid="overridden-card" className="border-status-info bg-surface-elevated">
          <CardTitle>Compact heading</CardTitle>
        </Card>
        <Button>Save changes</Button>
        <Button disabled>Unavailable</Button>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByTestId("glass-card");
    const styles = getComputedStyle(card);
    await expect(styles.backdropFilter).toBe("blur(12px)");
    await expect(styles.borderRadius).toBe("16px");
    await expect(getComputedStyle(canvas.getByText("Shared title")).fontSize).toBe("20px");
    await expect(getComputedStyle(card).paddingLeft).toBe("24px");
    await expect(canvas.getByRole("textbox", { name: "Name" })).toHaveAccessibleDescription(
      "A name is required.",
    );
    await expect(getComputedStyle(canvas.getByText("Compact heading")).fontSize).toBe("20px");
    await expect(getComputedStyle(canvas.getByText("Compact heading")).fontWeight).toBe("700");
    await expect(getComputedStyle(canvas.getByTestId("overridden-card")).backgroundColor).toBe(
      "rgb(28, 28, 31)",
    );
    await userEvent.tab();
    await expect(canvas.getByRole("textbox", { name: "Name" })).toHaveFocus();
    const focusedInput = getComputedStyle(canvas.getByRole("textbox", { name: "Name" }));
    await expect(focusedInput.outlineStyle).toBe("none");
    await expect(focusedInput.boxShadow).not.toBe("none");
    const root = canvasElement.ownerDocument.documentElement;
    const previous = root.getAttribute("data-fd-transparency");
    try {
      root.setAttribute("data-fd-transparency", "reduce");
      await expect(getComputedStyle(card).backdropFilter).toBe("none");
      await expect(getComputedStyle(card).backgroundColor).toBe("rgb(20, 20, 22)");
    } finally {
      if (previous === null) root.removeAttribute("data-fd-transparency");
      else root.setAttribute("data-fd-transparency", previous);
    }
  },
};

export const Densities: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-4">
      {(["default", "sm"] as const).flatMap((size) =>
        (["glass", "solid"] as const).map((surface) => (
          <Card key={`${size}-${surface}`} size={size} surface={surface}>
            <CardTitle>
              {size} / {surface}
            </CardTitle>
            <CardContent>Consistent spacing with a direct title and a content region.</CardContent>
          </Card>
        )),
      )}
    </div>
  ),
};

export const LayoutContracts: Story = {
  render: () => (
    <div className="grid w-full max-w-72 gap-4">
      {(["default", "sm"] as const).flatMap((size) =>
        (["glass", "solid"] as const).map((surface) => (
          <Card key={`${size}-${surface}`} size={size} surface={surface}>
            <CardTitle>A longer heading that spans multiple lines</CardTitle>
            <CardContent>Content with consistent spacing.</CardContent>
          </Card>
        )),
      )}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const cards = Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="card"]'));
    for (const card of cards) {
      const padding = card.dataset.size === "sm" ? 16 : 24;
      const title = card.querySelector('[data-slot="card-title"]')!;
      await expect(getComputedStyle(card).paddingLeft).toBe(`${padding}px`);
      await expect(getComputedStyle(card).paddingTop).toBe(`${padding}px`);
      await expect(title.getBoundingClientRect().left - card.getBoundingClientRect().left).toBe(
        padding + 1,
      );
      await expect(getComputedStyle(title).fontSize).toBe("20px");
      await expect(getComputedStyle(title).lineHeight).toBe("28px");
      await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
    }
    await expect(cards[0]!.getBoundingClientRect().height).toBe(
      cards[1]!.getBoundingClientRect().height,
    );
    await expect(cards[2]!.getBoundingClientRect().height).toBe(
      cards[3]!.getBoundingClientRect().height,
    );
  },
};

export const Playground: Story = {
  parameters: { controls: { disable: false } },
  render: (args) => (
    <Card {...args} className="max-w-lg">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>A shared structure for every surface.</CardDescription>
      </CardHeader>
      <CardContent>Change the surface and density using Controls.</CardContent>
    </Card>
  ),
};

export const Composition: Story = {
  render: () => (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Summary with an action</CardTitle>
        <CardDescription>Supporting text may wrap naturally.</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>Content is independent of the header and footer.</CardContent>
      <CardFooter>
        <Button>Continue</Button>
        <Button variant="ghost">Cancel</Button>
      </CardFooter>
    </Card>
  ),
};
