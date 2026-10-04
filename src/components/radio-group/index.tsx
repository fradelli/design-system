"use client";

import { createContext, useContext, useRef, useState, type ComponentProps } from "react";
import { cn } from "../../lib/cn.js";

type RadioGroupContextValue = {
  value: string;
  name: string | undefined;
  disabled: boolean;
  required: boolean;
  setValue: (value: string) => void;
};
const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
const RadioItemContext = createContext<{ value: string; checked: boolean } | null>(null);

function useRadioGroupContext() {
  const context = useContext(RadioGroupContext);
  if (!context) throw new Error("RadioGroup parts must be rendered inside RadioGroup.Root.");
  return context;
}

export type RadioGroupRootProps = Omit<ComponentProps<"div">, "onChange" | "value"> & {
  value?: string;
  defaultValue?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  onValueChange?: (value: string) => void;
};

function Root({
  className,
  value: controlledValue,
  defaultValue = "",
  name,
  disabled = false,
  required = false,
  onValueChange,
  children,
  ...props
}: RadioGroupRootProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = controlledValue ?? uncontrolledValue;
  const setValue = (nextValue: string) => {
    if (controlledValue === undefined) setUncontrolledValue(nextValue);
    if (nextValue !== value) onValueChange?.(nextValue);
  };
  return (
    <RadioGroupContext.Provider value={{ value, name, disabled, required, setValue }}>
      <div
        role="radiogroup"
        data-slot="radio-group"
        aria-required={required || undefined}
        aria-disabled={disabled || undefined}
        className={className}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export type RadioGroupItemProps = Omit<ComponentProps<"button">, "type" | "value"> & {
  value: string;
};
function Item({
  className,
  value: itemValue,
  onClick,
  onKeyDown,
  disabled: itemDisabled = false,
  children,
  ref: consumerRef,
  ...props
}: RadioGroupItemProps) {
  const group = useRadioGroupContext();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const checked = group.value === itemValue;
  const disabled = group.disabled || itemDisabled;

  function moveSelection(key: string) {
    const current = buttonRef.current;
    const groupElement = current?.closest('[role="radiogroup"]');
    const items = Array.from(
      groupElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [],
    ).filter((item) => !item.disabled);
    if (!items.length || !current) return false;
    const currentIndex = items.indexOf(current);
    const nextIndex =
      key === "Home"
        ? 0
        : key === "End"
          ? items.length - 1
          : (currentIndex + (key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1) + items.length) %
            items.length;
    const next = items[nextIndex];
    if (!next) return false;
    next.focus();
    group.setValue(next.value);
    return true;
  }

  return (
    <RadioItemContext.Provider value={{ value: itemValue, checked }}>
      <span className="contents">
        <button
          ref={(node) => {
            buttonRef.current = node;
            if (typeof consumerRef === "function") consumerRef(node);
            else if (consumerRef) consumerRef.current = node;
          }}
          type="button"
          role="radio"
          value={itemValue}
          aria-checked={checked}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          tabIndex={disabled ? -1 : checked || !group.value ? 0 : -1}
          data-slot="radio-group-item"
          data-state={checked ? "checked" : "unchecked"}
          className={cn("relative", className)}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented && !disabled) group.setValue(itemValue);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented || disabled) return;
            if (
              ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(event.key)
            ) {
              event.preventDefault();
              moveSelection(event.key);
            } else if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              group.setValue(itemValue);
            }
          }}
          {...props}
        >
          {children}
        </button>
        {group.name ? (
          <input
            aria-hidden="true"
            tabIndex={-1}
            type="radio"
            name={group.name}
            value={itemValue}
            checked={checked}
            disabled={disabled}
            required={group.required}
            className="sr-only"
            readOnly
          />
        ) : null}
      </span>
    </RadioItemContext.Provider>
  );
}

function Indicator({ className, children, ...props }: ComponentProps<"span">) {
  const item = useContext(RadioItemContext);
  if (!item) throw new Error("RadioGroup.Indicator must be inside RadioGroup.Item.");
  if (!item.checked) return null;
  return (
    <span
      aria-hidden="true"
      data-slot="radio-group-indicator"
      data-state="checked"
      className={className}
      {...props}
    >
      {children}
    </span>
  );
}

export const RadioGroup = { Root, Item, Indicator };
export { Root as RadioGroupRoot, Item as RadioGroupItem, Indicator as RadioGroupIndicator };
