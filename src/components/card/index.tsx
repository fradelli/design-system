import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

import { Slot } from "../../lib/slot.js";

const cardVariants = cva(
  "group/card flex min-w-0 flex-col rounded-lg border text-xs/relaxed text-foreground fd-card",
  {
    variants: {
      size: { default: "fd-card-default", sm: "fd-card-compact" },
      surface: { glass: "fd-surface-glass", solid: "border-border bg-surface" },
    },
    defaultVariants: { size: "default", surface: "glass" },
  },
);

export type CardProps = ComponentProps<"div"> & VariantProps<typeof cardVariants>;

export function Card({ className, size, surface = "glass", ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-surface={surface ?? "glass"}
      data-size={size ?? "default"}
      className={cn(cardVariants({ size, surface: surface ?? "glass" }), className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header grid min-w-0 auto-rows-min items-start gap-1 has-[>[data-slot=card-action]]:grid-cols-[minmax(0,1fr)_auto]",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  asChild,
  ...props
}: ComponentProps<"div"> & { asChild?: boolean }) {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      data-slot="card-title"
      className={cn("font-heading text-sm font-medium", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-xs/relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

export function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("min-w-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

export { cardVariants };
