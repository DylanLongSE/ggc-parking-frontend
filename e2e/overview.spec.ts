import { test, expect } from "./fixtures";

test("overview page shows heading and totals @regression", async ({
  homePage,
  overviewPage,
}) => {
  await homePage.goto();
  await homePage.selectTab("Overview");
  await expect(overviewPage.heading).toBeVisible();
  await expect(overviewPage.totalSummary).toBeVisible();
});

test("overview shows correct available count from mock @regression", async ({
  homePage,
  overviewPage,
}) => {
  await homePage.goto();
  await homePage.selectTab("Overview");
  // Mock returns occupied=12, Lot W has 36 total → 24 available
  await expect(overviewPage.totalSummary).toContainText("24 of 36");
});

test("overview renders all lot cards @regression", async ({
  homePage,
  overviewPage,
}) => {
  await homePage.goto();
  await homePage.selectTab("Overview");
  // 5 lots total: Lot W, Parking Deck, A Lot, L Lot, 3000 Lot
  await expect(overviewPage.lotCards).toHaveCount(5);
});

test("coming soon lots show badge in overview @regression", async ({
  homePage,
  overviewPage,
}) => {
  await homePage.goto();
  await homePage.selectTab("Overview");
  await expect(overviewPage.getComingSoonBadge("Parking Deck")).toBeVisible();
  await expect(overviewPage.getComingSoonBadge("A Lot")).toBeVisible();
  await expect(overviewPage.getComingSoonBadge("L Lot")).toBeVisible();
  await expect(overviewPage.getComingSoonBadge("3000 Lot")).toBeVisible();
});
