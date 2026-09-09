import type { Preview } from "@storybook/react-vite";

import "./preview.css";

const preview = {
  parameters: {
    layout: "fullscreen",
    a11y: { test: "error" },
    backgrounds: { default: "dark" },
  },
} satisfies Preview;

export default preview;
