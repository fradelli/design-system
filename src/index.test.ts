import { describe, expect, it } from "vitest";

import * as publicApi from "./index.js";

describe("public API", () => {
  it("keeps the root empty so consumers choose an explicit subpath", () => {
    expect(Object.keys(publicApi)).toEqual([]);
  });
});
