import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:5173",
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: "yarn dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
