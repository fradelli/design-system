import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:brightness-95",
        destructive: "bg-status-destructive text-status-destructive-foreground hover:brightness-95",
        outline: "border border-border bg-transparent text-foreground hover:bg-surface-interactive",
        secondary: "bg-surface-interactive text-foreground hover:brightness-110",
        ghost: "text-foreground hover:bg-surface-interactive",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 [&>svg]:size-4",
        xs: "h-6 gap-1 rounded-sm px-2 text-xs [&>svg]:size-3",
        sm: "h-8 gap-1.5 px-3 [&>svg]:size-4",
        lg: "h-10 px-6 [&>svg]:size-5",
        icon: "size-9 [&>svg]:size-4",
        "icon-xs": "size-6 rounded-sm [&>svg]:size-3",
        "icon-sm": "size-8 [&>svg]:size-4",
        "icon-lg": "size-10 [&>svg]:size-5",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
