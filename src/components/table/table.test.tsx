// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./index.js";

afterEach(cleanup);

it("renders an accessible table inside a horizontally scrollable container", () => {
  render(
    <Table className="min-w-96">
      <TableCaption>Weekly totals</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Week</TableHead>
          <TableHead scope="col">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow data-state="selected">
          <TableHead scope="row">First</TableHead>
          <TableCell>12</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>12</TableCell>
        </TableRow>
      </TableFooter>
    </Table>,
  );

  const table = screen.getByRole("table", { name: "Weekly totals" });
  expect(table).toHaveClass("w-full", "min-w-96");
  expect(table.parentElement).toHaveAttribute("data-slot", "table-container");
  expect(table.parentElement).toHaveClass("overflow-x-auto");
  expect(screen.getByRole("columnheader", { name: "Week" })).toHaveAttribute(
    "data-slot",
    "table-head",
  );
  const row = screen.getByRole("rowheader", { name: "First" }).closest("tr");
  expect(row).toHaveAttribute("data-state", "selected");
  expect(within(row as HTMLElement).getByRole("cell", { name: "12" })).toHaveAttribute(
    "data-slot",
    "table-cell",
  );
});
