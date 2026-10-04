import { cloneElement, isValidElement, type ReactElement, type ReactNode, type Ref } from "react";

type SlotProps = Readonly<{
  children?: ReactNode;
  className?: string | undefined;
  [prop: string]: unknown;
}>;

/** Applies primitive props to one child while preserving the child's handlers. */
export function Slot({ children, className, ...slotProps }: SlotProps) {
  if (!isValidElement(children)) {
    throw new Error("Slot expects exactly one React element child.");
  }

  const child = children as ReactElement<Record<string, unknown>>;
  const childProps = child.props;
  const mergedProps: Record<string, unknown> = { ...slotProps, ...childProps };

  for (const [name, slotValue] of Object.entries(slotProps)) {
    const childValue = childProps[name];
    if (
      name.startsWith("on") &&
      typeof slotValue === "function" &&
      typeof childValue === "function"
    ) {
      mergedProps[name] = (...args: unknown[]) => {
        (childValue as (...values: unknown[]) => void)(...args);
        (slotValue as (...values: unknown[]) => void)(...args);
      };
    }
  }

  if (className || typeof childProps.className === "string") {
    mergedProps.className = [className, childProps.className].filter(Boolean).join(" ");
  }
  if (slotProps.style || childProps.style) {
    mergedProps.style = { ...(slotProps.style as object), ...(childProps.style as object) };
  }
  const slotRef = slotProps.ref as Ref<unknown> | undefined;
  const childRef = childProps.ref as Ref<unknown> | undefined;
  if (slotRef || childRef) {
    mergedProps.ref = (value: unknown) => {
      assignRef(childRef, value);
      assignRef(slotRef, value);
    };
  }

  return cloneElement(child, mergedProps);
}

function assignRef<T>(ref: Ref<T> | undefined, value: T) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}
