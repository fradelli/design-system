import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/table/index.js";

const rows = [
  { name: "Foundations", open: 2, done: 9 },
  { name: "Forms", open: 4, done: 6 },
  { name: "Navigation", open: 1, done: 3 },
];

const meta = {
  title: "Components/Table",
  component: Table,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table className="max-w-xl">
      <TableCaption>Work items by area</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Area</TableHead>
          <TableHead scope="col">Open</TableHead>
          <TableHead scope="col" className="text-right">
            Done
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.name} data-state={row.name === "Forms" ? "selected" : undefined}>
            <TableHead scope="row">{row.name}</TableHead>
            <TableCell>{row.open}</TableCell>
            <TableCell className="text-right">{row.done}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>7</TableCell>
          <TableCell className="text-right">18</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole("table", { name: "Work items by area" });
    await expect(table).toBeVisible();
    await expect(within(table).getAllByRole("row")).toHaveLength(5);
  },
};
