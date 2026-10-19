import { useLayoutEffect, useState, type RefObject } from "react";
import { getPopoverPosition, type PopoverAlign, type PopoverSide } from "./popover-position.js";

export function usePopoverPosition(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLDivElement | null>,
  side: PopoverSide,
  align: PopoverAlign,
  offset: number,
  padding: number,
) {
  const [position, setPosition] = useState({ top: 0, left: 0, side });
  useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const content = contentRef.current;
    if (!trigger || !content) return;
    const update = () => {
      const next = getPopoverPosition(
        trigger.getBoundingClientRect(),
        content.getBoundingClientRect(),
        { width: window.innerWidth, height: window.innerHeight },
        side,
        align,
        offset,
        padding,
      );
      setPosition((previous) =>
        previous.top === next.top && previous.left === next.left && previous.side === next.side
          ? previous
          : next,
      );
    };
    update();
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(update);
    observer?.observe(trigger);
    observer?.observe(content);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, triggerRef, contentRef, side, align, offset, padding]);
  return position;
}
