import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type InputProps = ComponentProps<"input">;

export function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "fd-focus-managed h-9 w-full min-w-0 rounded-md border border-input bg-surface-elevated/60 px-3 py-1 text-base text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-focus-ring focus-visible:ring-2 focus-visible:ring-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-status-destructive aria-invalid:ring-status-destructive md:text-sm",
        className,
      )}
      {...props}
    />
  );
}
