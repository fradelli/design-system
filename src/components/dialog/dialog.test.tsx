// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./index.js";

afterEach(cleanup);

it("names the close controls with the consumer's labels", () => {
  render(
    <Dialog open>
      <DialogContent closeLabel="Fechar detalhes">
        <DialogTitle>Detalhes</DialogTitle>
        <DialogFooter showCloseButton closeLabel="Fechar" />
      </DialogContent>
    </Dialog>,
  );
  expect(screen.getByRole("button", { name: "Fechar detalhes" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
  expect(screen.queryByText("Close")).not.toBeInTheDocument();
});

it("renders no close control when the corner button is hidden", () => {
  render(
    <Dialog open>
      <DialogContent showCloseButton={false}>
        <DialogTitle>Detalhes</DialogTitle>
      </DialogContent>
    </Dialog>,
  );
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

it("requires a close label whenever a close control is rendered", () => {
  const missingContentLabel = (
    // @ts-expect-error The corner close button needs `closeLabel`.
    <DialogContent>
      <DialogTitle>Detalhes</DialogTitle>
    </DialogContent>
  );
  // @ts-expect-error The footer close button needs `closeLabel`.
  const missingFooterLabel = <DialogFooter showCloseButton />;
  expect([missingContentLabel, missingFooterLabel]).toHaveLength(2);
});
