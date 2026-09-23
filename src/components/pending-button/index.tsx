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
  ...props
}: PendingButtonProps) {
  return (
    <Button
      {...props}
      data-slot="pending-button"
      className={cn("relative", className)}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
    >
      <span aria-hidden={pending} className={cn(pending && "invisible")}>
        {children}
      </span>
      {pending ? (
        <span className="absolute inset-0 inline-flex items-center justify-center gap-2">
          <SpinnerGapIcon
            aria-hidden="true"
            className="size-4 animate-spin motion-reduce:animate-none"
          />
          {pendingLabel}
        </span>
      ) : null}
    </Button>
  );
}
