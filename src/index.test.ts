import { describe, expect, it } from "vitest";

import * as publicApi from "./index.js";

describe("public API", () => {
  it("starts empty until shared primitives are admitted", () => {
    expect(Object.keys(publicApi)).toEqual([]);
  });
});
