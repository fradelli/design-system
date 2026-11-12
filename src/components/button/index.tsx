import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";
import { Slot } from "../../lib/slot.js";

const buttonVariants = cva(
  "fd-focus-managed group/button cursor-default inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-focus-ring focus-visible:ring-2 focus-visible:ring-focus-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-status-destructive aria-invalid:ring-2 aria-invalid:ring-status-destructive/20 dark:aria-invalid:border-status-destructive/50 dark:aria-invalid:ring-status-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border hover:bg-input/50 hover:text-foreground aria-expanded:bg-surface-interactive aria-expanded:text-foreground dark:bg-input/30",
        secondary:
          "bg-surface-interactive text-foreground hover:bg-[color-mix(in_oklch,var(--fd-color-surface-interactive),var(--fd-color-foreground)_5%)] aria-expanded:bg-surface-interactive aria-expanded:text-foreground",
        ghost:
          "hover:bg-surface-interactive hover:text-foreground aria-expanded:bg-surface-interactive aria-expanded:text-foreground dark:hover:bg-surface-interactive/50",
        destructive:
          "bg-status-destructive/10 text-status-destructive hover:bg-status-destructive/20 focus-visible:border-status-destructive/40 focus-visible:ring-status-destructive/20 dark:bg-status-destructive/20 dark:hover:bg-status-destructive/30 dark:focus-visible:ring-status-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-5 gap-1 rounded-sm px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-2.5",
        sm: "h-6 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        lg: "h-8 gap-1 px-2.5 text-xs/relaxed has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-xs": "size-5 rounded-sm [&_svg:not([class*='size-'])]:size-2.5",
        "icon-sm": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-lg": "size-8 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    tone?: "neutral" | "navigation" | "general" | "start" | "warm" | "cool" | "danger";
    asChild?: boolean;
  };

export function Button({ className, variant, size, tone, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      data-slot="button"
      data-fd-tone={tone}
      data-fd-variant={variant}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
