// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "./index.js";
afterEach(cleanup);
it("opens actions on right click and invokes the selected item", async () => {
  const action = vi.fn();
  render(
    <ContextMenu>
      <ContextMenuTrigger>Group</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={action}>Rename</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>,
  );
  fireEvent.contextMenu(screen.getByText("Group"), { clientX: 10, clientY: 10 });
  fireEvent.click(await screen.findByRole("menuitem", { name: "Rename" }));
  expect(action).toHaveBeenCalledOnce();
});
