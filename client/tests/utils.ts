import { expect, Page, Locator, APIRequestContext } from "@playwright/test";

export const TOKEN_KEY = "rpsls_token";
export const NAME_KEY = "rpsls_name";

export function attachNetLogs(page: Page) {
  page.on("request", (r) => console.log("➡️", r.method(), r.url()));
  page.on("response", (r) => console.log("⬅️", r.status(), r.url()));
}

export function apiBase(): string {
  return process.env.VITE_API_BASE || "http://localhost:5209/api";
}

export async function createGuest(
  request: APIRequestContext
): Promise<{ token: string; name: string }> {
  const res = await request.post(`${apiBase()}/players/guest`);
  if (!res.ok()) {
    throw new Error(
      `Failed to create guest: ${res.status()} ${res.statusText()}`
    );
  }
  return (await res.json()) as { token: string; name: string };
}

export async function seedSessionStorage(
  page: Page,
  token: string,
  name: string
) {
  await page.addInitScript(
    ([tk, nk, t, n]) => {
      try {
        sessionStorage.setItem(tk, t);
        sessionStorage.setItem(nk, n);
        // eslint-disable-next-line no-empty
      } catch {}
    },
    [TOKEN_KEY, NAME_KEY, token, name]
  );
}

export function getOutcomeLocator(page: Page): Locator {
  const a = page.getByTestId("result-text");
  const b = page.locator(".score-board__outcome");
  const c = page.locator('[data-testid="score-outcome"]');
  return a.or(b).or(c).first();
}

export async function expectOutcomeVisible(page: Page) {
  const outcome = getOutcomeLocator(page);
  await expect(outcome).toBeVisible({ timeout: 10_000 });
  await expect(outcome).toHaveText(/WIN|LOSE|TIE/i, { timeout: 10_000 });
}

export async function clickChoice(page: Page, label: string) {
  const exact = page.getByRole("button", {
    name: new RegExp(`^${label}$`, "i"),
  });
  if (await exact.count()) return exact.first().click();

  const partial = page.getByRole("button", { name: new RegExp(label, "i") });
  if (await partial.count()) return partial.first().click();

  const byClass = page
    .locator("button.choice-grid__btn")
    .or(page.locator("button.choice-btn"));
  if (!(await byClass.count())) throw new Error("No choice buttons found");
  return byClass.nth(0).click();
}

export async function gotoApp(page: Page, baseURL?: string) {
  await page.goto((baseURL ?? "http://localhost:5173") + "/");
}
