import type { ComponentProps } from "react";
import { buttonVariants, type ButtonProps } from "../button/index.js";
import { cn } from "../../lib/cn.js";
import { Slot } from "../../lib/slot.js";

export type NavigationItemProps = ComponentProps<"a"> & {
  asChild?: boolean;
  size?: ButtonProps["size"];
};

export function NavigationItem({ className, asChild, size, ...props }: NavigationItemProps) {
  const Component = asChild ? Slot : "a";
  return (
    <Component
      data-slot="navigation-item"
      className={cn(buttonVariants({ size, variant: "ghost" }), className)}
      {...props}
    />
  );
}
