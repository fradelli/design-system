import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type SwitchProps = Omit<ComponentProps<"button">, "aria-checked" | "aria-label" | "role"> & {
  checked: boolean;
  "aria-label": string;
};

export function Switch({ checked, className, disabled, type = "button", ...props }: SwitchProps) {
  return (
    <button
      type={type}
      role="switch"
      aria-checked={checked}
      data-slot="switch"
      data-state={checked ? "checked" : "unchecked"}
      className={cn(
        "group/switch relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border bg-surface-interactive p-0.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-status-info-border data-[state=checked]:bg-status-info-solid motion-reduce:transition-none",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      <span
        data-slot="switch-thumb"
        aria-hidden="true"
        className="pointer-events-none block size-4.5 rounded-full bg-foreground shadow-xs transition-transform group-data-[state=checked]/switch:translate-x-5 motion-reduce:transition-none"
      />
    </button>
  );
}
