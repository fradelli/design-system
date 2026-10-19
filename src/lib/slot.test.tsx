/** @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { Button } from "../components/button/index.js";
afterEach(cleanup);
it("lets a child override conflicting utilities and prevent primitive activation", async () => {
  const primitive = vi.fn((event: React.MouseEvent) => {
    if (!event.defaultPrevented) throw new Error("child cancellation was lost");
  });
  const childRef = createRef<HTMLAnchorElement>();
  const outerRef = createRef<HTMLButtonElement>();
  render(
    <Button asChild ref={outerRef} className="px-4" onClick={primitive}>
      <a
        ref={childRef}
        href="#details"
        className="px-8"
        onClick={(event) => event.preventDefault()}
      >
        Details
      </a>
    </Button>,
  );
  const link = screen.getByRole("link");
  expect(link).toHaveClass("px-8");
  expect(link).not.toHaveClass("px-4");
  expect(childRef.current).toBe(link);
  expect(outerRef.current).toBe(link);
  await userEvent.click(link);
  expect(primitive).toHaveBeenCalledOnce();
});
