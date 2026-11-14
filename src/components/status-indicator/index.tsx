import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type StatusIndicatorProps = Omit<ComponentProps<"span">, "children"> & {
  tone?: "neutral" | "success" | "warning" | "destructive";
  pulse?: boolean;
};

/** A decorative dot unless the consumer supplies an accessible label. */
export function StatusIndicator({
  className,
  tone = "neutral",
  pulse = false,
  ...props
}: StatusIndicatorProps) {
  const labeled = Boolean(props["aria-label"] || props["aria-labelledby"]);
  return (
    <span
      data-slot="status-indicator"
      data-tone={tone}
      data-pulse={pulse}
      role={labeled ? "img" : undefined}
      aria-hidden={labeled ? undefined : true}
      className={cn("fd-status-indicator", className)}
      {...props}
    />
  );
}
