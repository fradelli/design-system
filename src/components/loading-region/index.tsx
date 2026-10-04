import type { ComponentProps, ReactNode } from "react";

import { cn } from "../../lib/cn.js";

export type LoadingRegionProps = ComponentProps<"section"> & { label: string; children: ReactNode };

export function LoadingRegion({ children, className, label, ...props }: LoadingRegionProps) {
  return (
    <section
      data-slot="loading-region"
      aria-busy="true"
      aria-label={label}
      className={cn("grid gap-4", className)}
      {...props}
    >
      <p className="sr-only" role="status">
        {label}
      </p>
      {children}
    </section>
  );
}
