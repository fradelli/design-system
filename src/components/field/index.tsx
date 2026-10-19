import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../../lib/cn.js";
import { Label } from "../label/index.js";
import { Separator } from "../separator/index.js";

export function FieldSet({ className, ...props }: ComponentProps<"fieldset">) {
  return <fieldset data-slot="field-set" className={cn("grid gap-6", className)} {...props} />;
}

export function FieldLegend({
  className,
  variant = "legend",
  ...props
}: ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-3 font-semibold data-[variant=legend]:text-base data-[variant=label]:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export function FieldGroup({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="field-group" className={cn("grid gap-6", className)} {...props} />;
}

const fieldVariants = cva(
  "group/field flex min-w-0 w-full gap-2 data-[invalid=true]:text-status-destructive",
  {
    variants: {
      orientation: {
        vertical: "flex-col",
        horizontal: "flex-row items-center",
        responsive: "flex-col sm:flex-row sm:items-center",
      },
    },
    defaultVariants: { orientation: "vertical" },
  },
);

export type FieldProps = ComponentProps<"div"> & VariantProps<typeof fieldVariants>;

export function Field({ className, orientation, ...props }: FieldProps) {
  return (
    <div
      data-slot="field"
      data-orientation={orientation ?? "vertical"}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

export function FieldContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("grid min-w-0 flex-1 gap-1", className)}
      {...props}
    />
  );
}

export function FieldLabel({ className, ...props }: ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" className={cn("w-fit", className)} {...props} />;
}

export function FieldTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="field-title" className={cn("text-sm font-medium", className)} {...props} />
  );
}

export function FieldDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function FieldSeparator({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-separator"
      className={cn("my-2 flex items-center gap-2", className)}
      {...props}
    >
      <Separator className="min-w-0 flex-1" />
      {children ? (
        <span className="shrink-0 text-xs leading-4 text-muted-foreground">{children}</span>
      ) : null}
      {children ? <Separator className="min-w-0 flex-1" /> : null}
    </div>
  );
}

export type FieldErrorItem = { message?: string } | undefined;
export type FieldErrorProps = ComponentProps<"div"> & {
  errors?: FieldErrorItem[];
  children?: ReactNode;
};

export function FieldError({ className, children, errors, ...props }: FieldErrorProps) {
  const messages = [
    ...new Set(errors?.flatMap((error) => (error?.message ? [error.message] : [])) ?? []),
  ];
  const content =
    children ??
    (messages.length > 1 ? (
      <ul className="ml-4 list-disc">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    ) : (
      messages[0]
    ));
  if (!content) return null;
  return (
    <div
      data-slot="field-error"
      className={cn("text-sm text-status-destructive", className)}
      {...props}
    >
      {content}
    </div>
  );
}

export { fieldVariants };
