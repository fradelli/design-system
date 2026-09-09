import { describe, expect, it } from "vitest";

import { cn } from "./cn.js";

describe("cn", () => {
  it("combines conditional classes and resolves Tailwind conflicts", () => {
    const hidden = false;
    expect(cn("px-2", hidden ? "hidden" : undefined, ["px-4", "text-sm"])).toBe("px-4 text-sm");
  });
});
