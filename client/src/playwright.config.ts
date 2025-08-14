import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:5173", // where Vite serves the UI
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev", // starts Vite
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    env: { VITE_API_BASE: "http://localhost:5209/api" },
    stdout: "ignore",
    stderr: "pipe",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
