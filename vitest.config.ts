import path from "path";

import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
    },
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.unit.test.{ts,tsx}"],
          globals: true,
          environment: "jsdom",
          setupFiles: ["./src/test/setupTest.ts"],
          css: true,
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["src/**/*.integration.test.{ts,tsx}"],
          globals: true,
          environment: "jsdom",
          setupFiles: ["./src/test/setupTest.ts"],
          css: true,
        },
      },
    ],
  },
});
