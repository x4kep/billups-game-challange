import { test, expect } from "@playwright/test";
import {
  createGuest,
  seedSessionStorage,
  gotoApp,
  TOKEN_KEY,
  NAME_KEY,
} from "./utils";

test.describe("Token", () => {
  test("guest token/name are present in sessionStorage before app loads", async ({
    page,
    request,
    baseURL,
  }) => {
    const { token, name } = await createGuest(request);
    await seedSessionStorage(page, token, name);
    await gotoApp(page, baseURL);

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
});
