import { test, expect } from "@playwright/test";
import { createGuest, seedSessionStorage, gotoApp } from "./utils";

test.describe("Choices", () => {
  test.beforeEach(async ({ page, request, baseURL }) => {
    const { token, name } = await createGuest(request);
    await seedSessionStorage(page, token, name);
    await gotoApp(page, baseURL);
  });

  test("five choices render and reset button visible", async ({ page }) => {
    const choiceButtons = page
      .locator("button.choice-grid__btn")
      .or(page.locator("button.choice-btn"));
    await expect(choiceButtons).toHaveCount(5, { timeout: 5000 });
    await expect(page.getByRole("button", { name: /reset/i })).toBeVisible();
  });
});
