import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, ReactNode } from "react";

import "./foundations.css";

const meta = {
  title: "Foundations",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="foundations">
      <h1>{title}</h1>
      {children}
    </main>
  );
}

const categories = ["yellow", "orange", "red", "pink", "purple", "blue", "cyan", "green"];

export const Colors: Story = {
  render: () => (
    <Page title="Colors">
      <section className="foundation-grid" aria-label="Category colors">
        {categories.map((name) => (
          <article className="swatch" key={name}>
            <div
              className="swatch-color"
              style={
                {
                  "--swatch": `var(--fd-color-category-${name}-solid)`,
                  "--swatch-border": `var(--fd-color-category-${name}-border)`,
                } as CSSProperties
              }
            />
            <strong>Category {name}</strong>
            <span className="token-name">--fd-color-category-{name}-solid</span>
          </article>
        ))}
      </section>
    </Page>
  ),
};

const typography = [
  ["Body", "var(--fd-font-size-md)", "var(--fd-font-weight-body)"],
  ["Label", "var(--fd-font-size-sm)", "var(--fd-font-weight-label)"],
  ["Emphasis", "var(--fd-font-size-md)", "var(--fd-font-weight-emphasis)"],
  ["Heading", "var(--fd-font-size-xl)", "var(--fd-font-weight-heading)"],
  ["Display", "var(--fd-font-size-2xl)", "var(--fd-font-weight-display)"],
];

export const Typography: Story = {
  render: () => (
    <Page title="Typography">
      {typography.map(([name, size, weight]) => (
        <p key={name} style={{ fontSize: size, fontWeight: weight }}>
          {name} — Inter with system fallback
        </p>
      ))}
    </Page>
  ),
};

export const Spacing: Story = {
  render: () => (
    <Page title="Spacing">
      <section className="space-row" aria-label="Spacing scale">
        {[1, 2, 3, 4, 6, 8, 12].map((space) => (
          <div className="sample" key={space}>
            <div
              className="space-box"
              style={{ "--sample-size": `var(--fd-space-${space})` } as CSSProperties}
            />
            <span className="token-name">space-{space}</span>
          </div>
        ))}
      </section>
    </Page>
  ),
};

export const Radius: Story = {
  render: () => (
    <Page title="Radius">
      <section className="radius-row" aria-label="Radius scale">
        {["xs", "sm", "md", "lg", "xl", "full"].map((radius) => (
          <div className="sample" key={radius}>
            <div
              className="radius-box"
              style={{ "--sample-radius": `var(--fd-radius-${radius})` } as CSSProperties}
            />
            <span className="token-name">radius-{radius}</span>
          </div>
        ))}
      </section>
    </Page>
  ),
};

export const Focus: Story = {
  render: () => (
    <Page title="Focus">
      <p>Use Tab to inspect the shared focus ring.</p>
      <button className="focus-example" type="button">
        Focus example
      </button>
    </Page>
  ),
};
