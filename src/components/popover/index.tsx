"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn.js";
import { Slot } from "../../lib/slot.js";

type PopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
};
const PopoverContext = createContext<PopoverContextValue | null>(null);
function usePopoverContext() {
  const value = useContext(PopoverContext);
  if (!value) throw new Error("Popover parts must be rendered inside Popover.Root.");
  return value;
}

export type PopoverRootProps = Readonly<{
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;
function Root({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: PopoverRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const setOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };
  return (
    <PopoverContext.Provider
      value={{ open, setOpen, triggerId: `${generatedId}-trigger`, triggerRef, contentRef }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

function Trigger({
  asChild = false,
  onClick,
  ...props
}: ComponentProps<"button"> & { asChild?: boolean }) {
  const context = usePopoverContext();
  const Component = asChild ? Slot : "button";
  return (
    <Component
      type="button"
      id={context.triggerId}
      aria-haspopup="dialog"
      aria-expanded={context.open}
      aria-controls={`${context.triggerId}-content`}
      {...props}
      ref={context.triggerRef as never}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        onClick?.(event as never);
        if (!event.defaultPrevented) context.setOpen(!context.open);
      }}
    />
  );
}

export type PopoverContentProps = Omit<ComponentProps<"div">, "role"> & {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  collisionPadding?: number;
  onOpenAutoFocus?: (event: { preventDefault: () => void }) => void;
  onCloseAutoFocus?: (event: { preventDefault: () => void }) => void;
};

function Content({
  className,
  style,
  side = "bottom",
  align = "center",
  sideOffset = 4,
  collisionPadding = 8,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onKeyDown,
  ...props
}: PopoverContentProps) {
  const context = usePopoverContext();
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const wasOpen = useRef(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!context.open || !mounted) return;
    const trigger = context.triggerRef.current;
    const content = context.contentRef.current;
    if (!trigger || !content) return;
    const anchor = trigger.getBoundingClientRect();
    const panel = content.getBoundingClientRect();
    const spacing = sideOffset;
    let top =
      side === "top"
        ? anchor.top - panel.height - spacing
        : side === "bottom"
          ? anchor.bottom + spacing
          : anchor.top;
    let left =
      side === "left"
        ? anchor.left - panel.width - spacing
        : side === "right"
          ? anchor.right + spacing
          : align === "start"
            ? anchor.left
            : align === "end"
              ? anchor.right - panel.width
              : anchor.left + (anchor.width - panel.width) / 2;
    if (
      side === "bottom" &&
      top + panel.height > window.innerHeight - collisionPadding &&
      anchor.top - panel.height - spacing >= collisionPadding
    )
      top = anchor.top - panel.height - spacing;
    top = Math.max(
      collisionPadding,
      Math.min(top, window.innerHeight - panel.height - collisionPadding),
    );
    left = Math.max(
      collisionPadding,
      Math.min(left, window.innerWidth - panel.width - collisionPadding),
    );
    setPosition({ top, left });
    const event = {
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
    };
    onOpenAutoFocus?.(event);
    if (!event.defaultPrevented) {
      const firstFocusable = content.querySelector<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      (firstFocusable ?? content).focus();
    }
    const closeFromOutside = (pointerEvent: PointerEvent) => {
      const target = pointerEvent.target;
      if (target instanceof Node && !content.contains(target) && !trigger.contains(target))
        context.setOpen(false);
    };
    document.addEventListener("pointerdown", closeFromOutside);
    return () => document.removeEventListener("pointerdown", closeFromOutside);
  }, [context.open, mounted, side, align, sideOffset, collisionPadding, onOpenAutoFocus]);

  useEffect(() => {
    if (context.open || !wasOpen.current) return;
    wasOpen.current = false;
    const event = {
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
    };
    onCloseAutoFocus?.(event);
    if (!event.defaultPrevented) context.triggerRef.current?.focus();
  }, [context.open, context.triggerRef, onCloseAutoFocus]);

  if (!mounted || !context.open) return null;
  wasOpen.current = true;
  const content = (
    <div
      ref={context.contentRef}
      id={`${context.triggerId}-content`}
      data-slot="popover-content"
      data-side={side}
      data-state="open"
      role="dialog"
      aria-labelledby={context.triggerId}
      tabIndex={-1}
      className={cn(
        "z-50 rounded-md border border-border bg-surface p-4 text-foreground shadow-md outline-none",
        className,
      )}
      style={{ position: "fixed", top: position.top, left: position.left, ...style }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "Escape") {
          event.preventDefault();
          context.setOpen(false);
        }
      }}
      {...props}
    />
  );
  return createPortal(content, document.body);
}

function Portal({ children }: { children: ReactNode }) {
  return children;
}

export const Popover = { Root, Trigger, Content, Portal };
export {
  Root as PopoverRoot,
  Trigger as PopoverTrigger,
  Content as PopoverContent,
  Portal as PopoverPortal,
};
