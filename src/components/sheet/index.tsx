"use client";

import { XIcon } from "@phosphor-icons/react/X";
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

type SheetContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  titleId: string;
  descriptionId: string;
};
const SheetContext = createContext<SheetContextValue | null>(null);

function useSheetContext() {
  const value = useContext(SheetContext);
  if (!value) throw new Error("Sheet parts must be rendered inside Sheet.");
  return value;
}

export type SheetProps = Readonly<{
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;

export function Sheet({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const triggerRef = useRef<HTMLElement>(null);
  const generatedId = useId();
  const setOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };
  return (
    <SheetContext.Provider
      value={{
        open,
        setOpen,
        triggerRef,
        titleId: `${generatedId}-title`,
        descriptionId: `${generatedId}-description`,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({
  asChild = false,
  onClick,
  ...props
}: ComponentProps<"button"> & { asChild?: boolean }) {
  const context = useSheetContext();
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

export function SheetClose({
  asChild = false,
  onClick,
  ...props
}: ComponentProps<"button"> & { asChild?: boolean }) {
  const context = useSheetContext();
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

export function SheetPortal({ children }: { children: ReactNode }) {
  return children;
}
export function SheetOverlay(_props: ComponentProps<"div">) {
  void _props;
  return null;
}

const sideClasses = {
  top: "inset-x-0 top-0 max-h-[85vh] border-b",
  right: "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l",
  bottom: "inset-x-0 bottom-0 max-h-[85vh] border-t",
  left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r",
} as const;

export type SheetContentProps = Omit<ComponentProps<"dialog">, "open" | "onClose"> & {
  side?: keyof typeof sideClasses;
  closeLabel: string;
  showCloseButton?: boolean;
};

export function SheetContent({
  className,
  children,
  side = "right",
  closeLabel,
  showCloseButton = true,
  onCancel,
  onKeyDown,
  ...props
}: SheetContentProps) {
  const context = useSheetContext();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (context.open && !dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
      const initialFocus = dialog.querySelector<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      (initialFocus ?? dialog).focus();
      wasOpen.current = true;
    } else if (!context.open && dialog.open) {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    }
  }, [context.open]);

  useEffect(() => {
    if (context.open || !wasOpen.current) return;
    wasOpen.current = false;
    context.triggerRef.current?.focus();
  }, [context.open, context.triggerRef]);

  return (
    <dialog
      ref={dialogRef}
      data-slot="sheet-content"
      data-side={side}
      data-state={context.open ? "open" : "closed"}
      aria-labelledby={context.titleId}
      aria-describedby={context.descriptionId}
      aria-modal="true"
      className={cn(
        "fixed m-0 flex flex-col gap-4 border-border bg-surface p-6 text-foreground shadow-lg backdrop:bg-black/70",
        sideClasses[side],
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
      {showCloseButton ? (
        <SheetClose
          aria-label={closeLabel}
          className="absolute top-4 right-4 rounded-sm text-muted-foreground opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:pointer-events-none"
        >
          <XIcon aria-hidden="true" className="size-4" />
        </SheetClose>
      ) : null}
    </dialog>
  );
}

export function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="sheet-header" className={cn("flex flex-col gap-1.5", className)} {...props} />
  );
}
export function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2", className)}
      {...props}
    />
  );
}
export function SheetTitle({ className, ...props }: ComponentProps<"h2">) {
  const context = useSheetContext();
  return (
    <h2
      id={props.id ?? context.titleId}
      data-slot="sheet-title"
      className={cn("font-semibold", className)}
      {...props}
    />
  );
}
export function SheetDescription({ className, ...props }: ComponentProps<"p">) {
  const context = useSheetContext();
  return (
    <p
      id={props.id ?? context.descriptionId}
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
