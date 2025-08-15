import { test, expect } from "@playwright/test";
import {
  createGuest,
  seedSessionStorage,
  gotoApp,
  clickChoice,
  expectOutcomeVisible,
  getOutcomeLocator,
} from "./utils";

test.describe("Reset", () => {
  test.beforeEach(async ({ page, request, baseURL }) => {
    const { token, name } = await createGuest(request);
    await seedSessionStorage(page, token, name);
    await gotoApp(page, baseURL);

    // Ensure the choices are actually rendered before we try to click any
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector(
      "button.choice-grid__btn, button.choice-btn, [data-testid='choice-btn'], button[aria-label]",
      { state: "visible", timeout: 15000 }
    );
  });

  test("reset hides/removes outcome", async ({ page }) => {
    // Play one round (buttons are guaranteed visible from beforeEach)
    await clickChoice(page, "rock");
    await expectOutcomeVisible(page);

    // Click reset and wait for the API to confirm
    const resetPromise = page.waitForResponse((r) =>
      /\/api\/scores\/reset/i.test(r.url())
    );
    await page.getByRole("button", { name: /reset/i }).click();
    await resetPromise.catch(() => {});

    // Outcome should be removed or hidden after reset
    const outcome = getOutcomeLocator(page);
    await expect(async () => {
      const visible = await outcome.isVisible().catch(() => false);
      if (visible) throw new Error("Outcome still visible after reset");
    }).toPass({ intervals: [200, 400, 800], timeout: 10_000 });
  });
});
