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
      <h1 className="fd-text-display">{title}</h1>
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

const typography = ["display", "section", "card", "body", "interface", "label"];
export const Typography: Story = {
  render: () => (
    <Page title="Typography">
      <p className="fd-text-interface">
        Inter is supplied by the application; this preview uses the system fallback when Inter is
        not installed.
      </p>
      {typography.map((role) => (
        <p key={role} className={`fd-text-${role}`}>
          {role} — Clear hierarchy and consistent line height
        </p>
      ))}
    </Page>
  ),
};

export const Materials: Story = {
  render: () => (
    <Page title="Materials">
      <div className="grid gap-4 rounded-xl bg-[radial-gradient(ellipse_at_top_left,#7da7f2,transparent_65%)] p-4">
        <div className="fd-surface-glass rounded-xl border p-6">
          <h2 className="fd-text-card">Glass</h2>
          <p className="fd-text-interface">Material only: layout belongs to the component.</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="fd-text-card">Solid</h2>
          <p className="fd-text-interface">The same geometry on an opaque surface.</p>
        </div>
      </div>
    </Page>
  ),
};
export const Motion: Story = {
  render: () => (
    <Page title="Motion">
      <p className="fd-text-body">
        Motion uses the shared duration and easing tokens. Reduced motion disables decorative
        animation.
      </p>
      <p className="fd-text-interface">
        Fast: var(--fd-motion-duration-fast) — Normal: var(--fd-motion-duration-normal)
      </p>
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
