import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-1 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "border-border bg-surface text-foreground",
        success: "border-status-success-border bg-status-success-subtle text-foreground",
        warning: "border-status-warning-border bg-status-warning-subtle text-foreground",
        info: "border-status-info-border bg-status-info-subtle text-foreground",
        destructive:
          "border-status-destructive-border bg-status-destructive-subtle text-foreground [&>svg]:text-status-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type AlertProps = ComponentProps<"div"> & VariantProps<typeof alertVariants>;

export function Alert({ className, variant, ...props }: AlertProps) {
  return <div data-slot="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

export function AlertTitle({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="alert-title" className={cn("font-semibold", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-muted-foreground col-start-2 grid gap-1 text-sm", className)}
      {...props}
    />
  );
}

export function AlertAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="alert-action" className={cn("absolute top-3 right-3", className)} {...props} />
  );
}

export { alertVariants };
