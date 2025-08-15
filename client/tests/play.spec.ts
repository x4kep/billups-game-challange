import { test } from "@playwright/test";
import {
  createGuest,
  seedSessionStorage,
  gotoApp,
  clickChoice,
  expectOutcomeVisible,
} from "./utils";

test.describe("Play", () => {
  test.beforeEach(async ({ page, request, baseURL }) => {
    const { token, name } = await createGuest(request);
    await seedSessionStorage(page, token, name);
    await gotoApp(page, baseURL);

    // Ensure page is settled and choices are rendered
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector(
      "button.choice-grid__btn, button.choice-btn, [data-testid='choice-btn'], button[aria-label]",
      { state: "visible", timeout: 15000 }
    );
    await page
      .locator("button.choice-grid__btn")
      .or(page.locator("button.choice-btn"))
      .or(page.locator("[data-testid='choice-btn']"))
      .or(page.locator("button[aria-label]"))
      .first()
      .waitFor({ state: "visible", timeout: 15000 });
  });

  test("playing a round shows an outcome", async ({ page }) => {
    // Extra safety: assert we actually have 5 choices before clicking
    await page
      .locator("button.choice-grid__btn")
      .or(page.locator("button.choice-btn"))
      .or(page.locator("[data-testid='choice-btn']"))
      .or(page.locator("button[aria-label]"));
    await clickChoice(page, "rock");
    await expectOutcomeVisible(page);
  });
});
