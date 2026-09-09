import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type SkeletonProps = ComponentProps<"div">;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md bg-surface-interactive motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}
