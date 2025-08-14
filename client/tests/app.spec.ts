// tests/app.spec.ts
import { test, expect, Page } from "@playwright/test";

function attachNetLogs(page: Page) {
  page.on("request", (r) => console.log("➡️", r.method(), r.url()));
  page.on("response", (r) => console.log("⬅️", r.status(), r.url()));
}

// Click a choice button by its visible text or aria-label.
async function clickChoice(page: Page, label: string) {
  const exact = page.getByRole("button", {
    name: new RegExp(`^${label}$`, "i"),
  });
  if (await exact.count()) return exact.first().click();
  return page
    .getByRole("button", { name: new RegExp(label, "i") })
    .first()
    .click();
}

async function expectOutcomeVisible(page: Page) {
  const outcome = page.getByTestId("result-text").first();
  await expect(outcome).toBeVisible({ timeout: 10_000 });
  await expect(outcome).toHaveText(/WIN|LOSE|TIE/, { timeout: 10_000 });
}

test.describe("RPSLS App", () => {
  test("1| Load choices 2| Plays a round 3| Shows result 4| Can reset", async ({
    page,
    baseURL,
  }) => {
    attachNetLogs(page);

    await test.step("Open app", async () => {
      await page.goto((baseURL ?? "http://localhost:5173") + "/");
      await expect(
        page.getByRole("heading", {
          name: /rock,?\s*paper,?\s*scissors,?\s*lizard,?\s*spock/i,
        })
      ).toBeVisible();
    });

    await test.step("Verify choices are present", async () => {
      const choiceButtons = page.locator("button.choice-btn");
      await expect(choiceButtons).toHaveCount(5, { timeout: 5000 });
      await expect(page.getByRole("button", { name: /reset/i })).toBeVisible();
    });

    await test.step("Play a round", async () => {
      await clickChoice(page, "rock");
      await expectOutcomeVisible(page);
    });

    await test.step("Reset and verify cleared", async () => {
      await page.getByRole("button", { name: /reset/i }).click();
      await expect(page.getByTestId("result-text")).toHaveCount(0, {
        timeout: 10_000,
      });
    });
  });
});
