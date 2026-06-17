import { expect, test } from "@playwright/test";

test("renders the public login page", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
});
