import { test, expect } from "@playwright/test";

test("home page loads @smoke", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/GGC Parking/i);
});