import { test, expect } from "./fixtures";

const TAB_NAMES = ["Lots", "Overview", "Info", "Settings"];

test("all four tabs are visible @smoke", async ({ homePage }) => {
  await homePage.goto();
  for (const name of TAB_NAMES) {
    await expect(homePage.getTab(name)).toBeVisible();
  }
});

test("switching tabs shows correct content @smoke", async ({ homePage }) => {
  await homePage.goto();

  // Overview tab shows heading
  await homePage.selectTab("Overview");
  await expect(
    homePage.page.getByRole("heading", { name: "Parking Overview" })
  ).toBeVisible();

  // Info tab shows content
  await homePage.selectTab("Info");
  await expect(
    homePage.page.locator("[class*='opacity-100']").filter({ hasText: /info|about|how/i })
  ).toBeVisible();

  // Settings tab shows content
  await homePage.selectTab("Settings");
  await expect(
    homePage.page.locator("[class*='opacity-100']").filter({ hasText: /settings|preference/i })
  ).toBeVisible();

  // Back to Lots — map is visible again
  await homePage.selectTab("Lots");
  await expect(homePage.mapContainer).toBeVisible();
});

test("active tab has distinct styling @smoke", async ({ homePage }) => {
  await homePage.goto();

  // Lots tab is active by default — should have primary background
  const lotsTab = homePage.getTab("Lots");
  await expect(lotsTab).toHaveClass(/bg-primary/);

  // Switch to Overview — Overview should be active, Lots should not
  await homePage.selectTab("Overview");
  const overviewTab = homePage.getTab("Overview");
  await expect(overviewTab).toHaveClass(/bg-primary/);
  await expect(lotsTab).not.toHaveClass(/bg-primary/);
});
