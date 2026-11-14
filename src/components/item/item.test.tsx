// @vitest-environment jsdom
import * as React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";

import { Button } from "../button/index.js";
import { Item, ItemActions, ItemContent, ItemTitle } from "./index.js";

afterEach(cleanup);

it("keeps navigation and a sibling action independently keyboard accessible", async () => {
  const user = userEvent.setup();
  const action = vi.fn();
  render(
    <Item variant="elevated" aria-label="Current activity">
      <ItemContent>
        <Item render={<a href="#details" />}>
          <ItemTitle>Open activity</ItemTitle>
        </Item>
      </ItemContent>
      <ItemActions>
        <Button onClick={action}>Remove activity</Button>
      </ItemActions>
    </Item>,
  );
  await user.tab();
  expect(screen.getByRole("link", { name: "Open activity" })).toHaveFocus();
  await user.tab();
  expect(screen.getByRole("button", { name: "Remove activity" })).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(action).toHaveBeenCalledOnce();
  expect(screen.getByRole("link").querySelector("button")).toBeNull();
});
