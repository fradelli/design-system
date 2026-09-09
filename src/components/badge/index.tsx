import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-border bg-surface-interactive text-foreground",
        success: "border-status-success-border bg-status-success-subtle text-foreground",
        warning: "border-status-warning-border bg-status-warning-subtle text-foreground",
        info: "border-status-info-border bg-status-info-subtle text-foreground",
        destructive:
          "border-status-destructive-border bg-status-destructive-subtle text-foreground",
        outline: "border-border text-foreground",
        ghost: "border-transparent text-foreground hover:bg-surface-interactive",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };

export function Badge({ className, variant, asChild, ...props }: BadgeProps) {
  const Component = asChild ? Slot : "span";
  return (
    <Component data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
