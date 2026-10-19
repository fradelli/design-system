import tailwindcss from "@tailwindcss/vite";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: { enabled: false },
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
        },
      },
      {
        plugins: [tailwindcss(), storybookTest({ configDir: ".storybook" })],
        optimizeDeps: {
          include: [
            "@phosphor-icons/react/dist/ssr/Barbell",
            "@phosphor-icons/react/dist/ssr/ForkKnife",
            "@phosphor-icons/react/X",
          ],
        },
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            viewport: { width: Number(process.env.DS_VIEWPORT_WIDTH ?? 1280), height: 900 },
            instances: (process.env.DS_BROWSERS ?? "chromium")
              .split(",")
              .map((browser) => ({ browser: browser as "chromium" | "firefox" | "webkit" })),
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
