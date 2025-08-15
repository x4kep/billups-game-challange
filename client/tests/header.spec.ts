import { test, expect } from "@playwright/test";
import { createGuest, seedSessionStorage, gotoApp } from "./utils";

test.describe("Header", () => {
  test.beforeEach(async ({ page, request, baseURL }) => {
    const { token, name } = await createGuest(request);
    await seedSessionStorage(page, token, name);
    await gotoApp(page, baseURL);
  });

  test("renders game title", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: /rock.*paper.*scissors.*lizard.*spock/i,
      })
    ).toBeVisible();
    await expect(page.locator("h1.app-header")).toBeVisible();
  });
});
