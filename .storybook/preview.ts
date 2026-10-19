import type { Preview } from "@storybook/react-vite";

import "./preview.css";

const preview = {
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    options: {
      storySort: { method: "alphabetical", order: ["Foundations", "Components", "Patterns"] },
    },
    a11y: { test: "error" },
    backgrounds: { default: "dark" },
  },
} satisfies Preview;

export default preview;
