import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";
import { Slot } from "../../lib/slot.js";

export type NavigationItemProps = ComponentProps<"a"> & { asChild?: boolean };

export function NavigationItem({ className, asChild, ...props }: NavigationItemProps) {
  const Component = asChild ? Slot : "a";
  return (
    <Component
      data-slot="navigation-item"
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors outline-none hover:bg-surface-interactive hover:text-foreground focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground motion-reduce:transition-none [&>svg]:size-5 [&>svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}
