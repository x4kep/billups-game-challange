import { test, expect } from "@playwright/test";
import {
  attachNetLogs,
  createGuest,
  seedSessionStorage,
  gotoApp,
  clickChoice,
  expectOutcomeVisible,
  getOutcomeLocator,
  TOKEN_KEY,
  NAME_KEY,
} from "./utils";

test("Smoke: loads → choices → play → reset", async ({
  page,
  request,
  baseURL,
}) => {
  attachNetLogs(page);
  const { token, name } = await createGuest(request);
  await seedSessionStorage(page, token, name);

  await gotoApp(page, baseURL);

  // Header present
  await expect(
    page.getByRole("heading", { name: /rock.*paper.*scissors.*lizard.*spock/i })
  ).toBeVisible();

  // Choices present
  const choiceButtons = page
    .locator("button.choice-grid__btn")
    .or(page.locator("button.choice-btn"));
  await expect(choiceButtons).toHaveCount(5, { timeout: 5000 });

  // Play one round
  await clickChoice(page, "rock");
  await expectOutcomeVisible(page);

  // Reset clears outcome (hidden or removed)
  await page.getByRole("button", { name: /reset/i }).click();
  const outcome = getOutcomeLocator(page);
  await expect(async () => {
    const visible = await outcome.isVisible().catch(() => false);
    if (visible) throw new Error("Outcome still visible after reset");
  }).toPass({ intervals: [200, 400, 800], timeout: 10_000 });

  // Sanity check token persisted
  const stored = await page.evaluate(
    ([tk, nk]) => ({
      t: sessionStorage.getItem(tk),
      n: sessionStorage.getItem(nk),
    }),
    [TOKEN_KEY, NAME_KEY]
  );
  expect(stored.t).toBeTruthy();
  expect(stored.n).toBeTruthy();
});
