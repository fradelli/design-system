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
import { cn } from "../../lib/cn.js";
import { Slot } from "../../lib/slot.js";

type AlertDialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
};

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

function useAlertDialogContext() {
  const value = useContext(AlertDialogContext);
  if (!value) throw new Error("AlertDialog parts must be rendered inside AlertDialog.");
  return value;
}

export type AlertDialogProps = Readonly<{
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;

export function AlertDialog({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: AlertDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const generatedId = useId();
  const triggerRef = useRef<HTMLElement>(null);
  const setOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <AlertDialogContext.Provider
      value={{
        open,
        setOpen,
        titleId: `${generatedId}-title`,
        descriptionId: `${generatedId}-description`,
        triggerRef,
      }}
    >
      {children}
    </AlertDialogContext.Provider>
  );
}

export const AlertDialogTrigger = Trigger;
function Trigger({
  asChild = false,
  onClick,
  ...props
}: ComponentProps<"button"> & { asChild?: boolean }) {
  const context = useAlertDialogContext();
  const Component = asChild ? Slot : "button";
  return (
    <Component
      type="button"
      {...props}
      ref={context.triggerRef as never}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        onClick?.(event as never);
        if (!event.defaultPrevented) context.setOpen(true);
      }}
    />
  );
}

export function AlertDialogPortal({ children }: { children: ReactNode }) {
  return children;
}

export function AlertDialogOverlay({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-overlay"
      aria-hidden="true"
      className={cn("sr-only", className)}
      {...props}
    />
  );
}

export type AlertDialogContentProps = Omit<ComponentProps<"dialog">, "open" | "onClose"> & {
  onCloseAutoFocus?: (event: { preventDefault: () => void }) => void;
  onOpenAutoFocus?: (event: { preventDefault: () => void }) => void;
};

export function AlertDialogContent({
  className,
  children,
  onCloseAutoFocus,
  onOpenAutoFocus,
  onCancel,
  onKeyDown,
  ...props
}: AlertDialogContentProps) {
  const context = useAlertDialogContext();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (context.open && !dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
      wasOpen.current = true;
      const event = {
        defaultPrevented: false,
        preventDefault() {
          this.defaultPrevented = true;
        },
      };
      onOpenAutoFocus?.(event);
      if (!event.defaultPrevented) {
        const safeAction = dialog.querySelector<HTMLElement>("[data-alert-dialog-cancel]");
        const firstFocusable = dialog.querySelector<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        (safeAction ?? firstFocusable ?? dialog).focus();
      }
    } else if (!context.open && dialog.open) {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    }
  }, [context.open, onOpenAutoFocus]);

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

  return (
    <dialog
      ref={dialogRef}
      data-slot="alert-dialog-content"
      data-state={context.open ? "open" : "closed"}
      role="alertdialog"
      aria-labelledby={context.titleId}
      aria-describedby={context.descriptionId}
      aria-modal="true"
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl border border-border bg-surface p-6 text-foreground shadow-lg backdrop:bg-black/70",
        className,
      )}
      onCancel={(event) => {
        onCancel?.(event);
        if (!event.defaultPrevented) {
          event.preventDefault();
          context.setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented && event.key === "Escape") {
          event.preventDefault();
          context.setOpen(false);
        }
      }}
      {...props}
    >
      {children}
    </dialog>
  );
}

export function AlertDialogAction({
  asChild = false,
  onClick,
  ...props
}: ComponentProps<"button"> & { asChild?: boolean }) {
  return (
    <DialogAction data-alert-dialog-action="true" asChild={asChild} onClick={onClick} {...props} />
  );
}
export function AlertDialogCancel({
  asChild = false,
  onClick,
  ...props
}: ComponentProps<"button"> & { asChild?: boolean }) {
  return (
    <DialogAction data-alert-dialog-cancel="true" asChild={asChild} onClick={onClick} {...props} />
  );
}
function DialogAction({
  asChild,
  onClick,
  ...props
}: ComponentProps<"button"> & { asChild: boolean }) {
  const context = useAlertDialogContext();
  const Component = asChild ? Slot : "button";
  return (
    <Component
      type="button"
      {...props}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        onClick?.(event as never);
        if (!event.defaultPrevented) context.setOpen(false);
      }}
    />
  );
}

export function AlertDialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="alert-dialog-header" className={cn("grid gap-2", className)} {...props} />;
}
export function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}
export function AlertDialogTitle({ className, id, ...props }: ComponentProps<"h2">) {
  const context = useAlertDialogContext();
  return (
    <h2
      id={id ?? context.titleId}
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}
export function AlertDialogDescription({ className, id, ...props }: ComponentProps<"p">) {
  const context = useAlertDialogContext();
  return (
    <p
      id={id ?? context.descriptionId}
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
