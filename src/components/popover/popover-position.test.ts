import { describe, expect, it } from "vitest";
import { getPopoverPosition } from "./popover-position.js";
const anchor = { top: 100, bottom: 140, left: 200, right: 280, width: 80, height: 40 };
const panel = { width: 120, height: 80 };
const viewport = { width: 600, height: 400 };
describe("popover positioning", () => {
  it("honors alignment on horizontal sides", () => {
    expect(getPopoverPosition(anchor, panel, viewport, "right", "end", 4, 8)).toEqual({
      top: 60,
      left: 284,
      side: "right",
    });
  });
  it("flips a clipped side when the opposite has space", () => {
    expect(
      getPopoverPosition(
        { ...anchor, top: 340, bottom: 380 },
        panel,
        viewport,
        "bottom",
        "start",
        4,
        8,
      ),
    ).toEqual({ top: 256, left: 200, side: "top" });
  });
  it("keeps a panel inside the viewport gutters", () => {
    const result = getPopoverPosition(
      { ...anchor, left: 0, right: 80 },
      panel,
      viewport,
      "left",
      "start",
      4,
      8,
    );
    expect(result.left).toBeGreaterThanOrEqual(8);
    expect(result.left + panel.width).toBeLessThanOrEqual(592);
  });
});
