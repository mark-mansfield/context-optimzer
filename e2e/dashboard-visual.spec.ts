import { expect } from "@playwright/test";
import { test } from "@playwright/test";

/**
 * Visual regression: dashboard with trace detail visible.
 * - Navigates to dashboard, runs a query so a trace is selected and the trace-detail
 *   panel is visible, then takes a full-page screenshot and compares to the stored baseline.
 * - Baseline: first run creates e2e/dashboard-visual.spec.ts-snapshots/dashboard-trace-detail.png.
 *   To update the baseline after an intentional design change, run:
 *   npx playwright test dashboard-visual --update-snapshots
 */
test("dashboard trace-detail view matches visual baseline", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("dco-theme", "dark");
  });
  await page.goto("/");

  await page.getByRole("textbox", { name: /query input/i }).fill("test query");
  await page.getByRole("button", { name: /^run$/i }).click();

  await expect(page.getByRole("heading", { name: /node inspector/i })).toBeVisible({ timeout: 15_000 });

  await expect(page).toHaveScreenshot("dashboard-trace-detail.png", {
    fullPage: true,
  });
});
