import { SpinnerGapIcon } from "@phosphor-icons/react/SpinnerGap";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn.js";
import { Button } from "../button/index.js";

export type PendingButtonProps = Omit<ComponentProps<typeof Button>, "asChild"> & {
  pending: boolean;
  pendingLabel: string;
};
export function PendingButton({
  children,
  className,
  disabled,
  pending,
  pendingLabel,
  size,
  ...props
}: PendingButtonProps) {
  const iconOnly = size?.startsWith("icon") ?? false;
  return (
    <Button
      {...props}
      size={size}
      data-slot="pending-button"
      className={className}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      aria-label={pending ? pendingLabel : props["aria-label"]}
    >
      <span className="grid min-w-0 items-center justify-items-center">
        <span
          aria-hidden={pending || undefined}
          className={cn(
            "col-start-1 row-start-1 inline-flex items-center gap-2",
            pending && "invisible",
          )}
        >
          {children}
        </span>
        <span
          aria-hidden={!pending || undefined}
          className={cn(
            "col-start-1 row-start-1 inline-flex items-center justify-center gap-2",
            !pending && "invisible",
          )}
        >
          <SpinnerGapIcon
            aria-hidden="true"
            className={cn(
              "shrink-0 animate-spin motion-reduce:animate-none",
              size === "xs" || size === "icon-xs" ? "size-3" : "size-4",
            )}
          />
          {!iconOnly ? pendingLabel : null}
        </span>
      </span>
    </Button>
  );
}
