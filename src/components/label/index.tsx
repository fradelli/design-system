import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type LabelProps = ComponentProps<"label">;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm font-medium leading-5 select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-has-[:disabled]/field:cursor-not-allowed group-has-[:disabled]/field:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
