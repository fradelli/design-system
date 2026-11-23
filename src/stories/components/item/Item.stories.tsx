import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "../../../components/button/index.js";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "../../../components/item/index.js";
import { StatusIndicator } from "../../../components/status-indicator/index.js";

const meta = { title: "Components/Item", component: Item } satisfies Meta<typeof Item>;
export default meta;

export const PersistentActivity: StoryObj<typeof meta> = {
  render: () => (
    <Item variant="outline" size="sm" className="max-w-md" aria-label="Current activity">
      <ItemContent>
        <a
          href="#activity-details"
          className="fd-focus-managed rounded-md outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          <ItemTitle>
            <StatusIndicator tone="success" pulse aria-label="Active" />
            Return to activity
          </ItemTitle>
          <ItemDescription>Activity label · 00:24:00</ItemDescription>
        </a>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" tone="danger">
          Remove
        </Button>
      </ItemActions>
    </Item>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { name: "Active" })).toBeVisible();
    const link = canvas.getByRole("link", { name: /Return to activity/ });
    link.focus();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Remove" })).toHaveFocus();
  },
};

export const Paused: StoryObj<typeof meta> = {
  render: () => (
    <Item variant="outline" size="sm" className="max-w-md">
      <StatusIndicator tone="warning" aria-label="Paused" />
      <ItemContent>
        <ItemTitle>Paused activity</ItemTitle>
        <ItemDescription>Resume when ready.</ItemDescription>
      </ItemContent>
    </Item>
  ),
};
