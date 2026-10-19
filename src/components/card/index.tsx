import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

const cardVariants = cva("flex min-w-0 flex-col rounded-xl border text-foreground fd-card", {
  variants: {
    size: { default: "fd-card-default", sm: "fd-card-compact" },
    surface: { glass: "fd-surface-glass", solid: "border-border bg-surface" },
  },
  defaultVariants: { size: "default", surface: "glass" },
});

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
        "grid min-w-0 gap-1.5 has-[>[data-slot=card-action]]:grid-cols-[minmax(0,1fr)_auto]",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("fd-text-card", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm leading-5 text-muted-foreground", className)}
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
