import type { ComponentProps, CSSProperties } from "react";

import { cn } from "../../lib/cn.js";

const colors = {
  neutral: "var(--fd-color-muted-foreground)",
  purple: "var(--fd-color-category-purple-solid)",
  blue: "var(--fd-color-category-blue-solid)",
  cyan: "var(--fd-color-category-cyan-solid)",
  green: "var(--fd-color-category-green-solid)",
  yellow: "var(--fd-color-category-yellow-solid)",
  orange: "var(--fd-color-category-orange-solid)",
  red: "var(--fd-color-category-red-solid)",
  pink: "var(--fd-color-category-pink-solid)",
  lilac: "var(--fd-primitive-color-lilac-400)",
  sage: "var(--fd-primitive-color-sage-400)",
  peach: "var(--fd-primitive-color-peach-400)",
  sky: "var(--fd-primitive-color-sky-400)",
  rose: "var(--fd-primitive-color-rose-400)",
} as const;

export type ColorSwatchColor = keyof typeof colors;
export type ColorSwatchProps = Omit<ComponentProps<"span">, "children" | "color"> & {
  color?: ColorSwatchColor;
};

/** A color sample; decorative beside text, or labeled when used on its own. */
export function ColorSwatch({ color = "neutral", className, style, ...props }: ColorSwatchProps) {
  const labeled = Boolean(props["aria-label"] || props["aria-labelledby"]);
  return (
    <span
      data-slot="color-swatch"
      data-color={color}
      role={labeled ? "img" : undefined}
      aria-hidden={labeled ? undefined : true}
      className={cn("fd-color-swatch", className)}
      style={{ "--fd-swatch-color": colors[color], ...style } as CSSProperties}
      {...props}
    />
  );
}
