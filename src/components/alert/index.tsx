import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

const alertVariants = cva(
  "fd-alert relative grid w-full min-w-0 items-start gap-x-3 gap-y-1 rounded-lg border px-4 py-3 text-sm leading-5",
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
  return (
    <div
      data-slot="alert-title"
      className={cn("min-w-0 break-words font-semibold", className)}
      {...props}
    />
  );
}

export function AlertDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "min-w-0 grid gap-1 break-words text-sm leading-5 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function AlertAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="alert-action" className={cn("min-w-0 self-start", className)} {...props} />
  );
}

export { alertVariants };
