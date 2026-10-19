export type PopoverSide = "top" | "right" | "bottom" | "left";
export type PopoverAlign = "start" | "center" | "end";
type Rect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

/** Fixed viewport coordinates; flips only when the opposite side has enough room. */
export function getPopoverPosition(
  anchor: Rect,
  panel: Pick<Rect, "width" | "height">,
  viewport: { width: number; height: number },
  side: PopoverSide,
  align: PopoverAlign,
  offset: number,
  padding: number,
) {
  const available = {
    top: anchor.top - padding,
    bottom: viewport.height - anchor.bottom - padding,
    left: anchor.left - padding,
    right: viewport.width - anchor.right - padding,
  };
  const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;
  const required = (side === "top" || side === "bottom" ? panel.height : panel.width) + offset;
  const resolvedSide =
    available[side] < required && available[opposite[side]] >= required ? opposite[side] : side;
  const horizontal = resolvedSide === "left" || resolvedSide === "right";
  const aligned = (start: number, length: number, content: number) =>
    align === "start"
      ? start
      : align === "end"
        ? start + length - content
        : start + (length - content) / 2;
  let top = horizontal
    ? aligned(anchor.top, anchor.height, panel.height)
    : resolvedSide === "top"
      ? anchor.top - panel.height - offset
      : anchor.bottom + offset;
  let left = horizontal
    ? resolvedSide === "left"
      ? anchor.left - panel.width - offset
      : anchor.right + offset
    : aligned(anchor.left, anchor.width, panel.width);
  top = Math.max(padding, Math.min(top, viewport.height - panel.height - padding));
  left = Math.max(padding, Math.min(left, viewport.width - panel.width - padding));
  return { top, left, side: resolvedSide };
}
