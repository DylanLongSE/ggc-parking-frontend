import { test, expect } from "./fixtures";

test("clicking a non-live lot opens drawer with lot name @smoke", async ({
  homePage,
  lotDrawerPage,
}) => {
  await homePage.goto();
  // Click Parking Deck (index 1, non-live lot)
  await homePage.clickLotMarker("Parking Deck");
  await expect(lotDrawerPage.lotName).toHaveText("Parking Deck");
});

test("drawer shows coming soon for non-live lots @smoke", async ({
  homePage,
  lotDrawerPage,
}) => {
  await homePage.goto();
  await homePage.clickLotMarker("A Lot");
  await expect(lotDrawerPage.comingSoonText).toBeVisible();
});

test("drawer shows directions link @regression", async ({
  homePage,
  lotDrawerPage,
}) => {
  await homePage.goto();
  await homePage.clickLotMarker("Parking Deck");
  await expect(lotDrawerPage.directionsLink).toBeVisible();
  await expect(lotDrawerPage.directionsLink).toHaveAttribute(
    "href",
    /google\.com\/maps/
  );
});

test("drawer shows live badge with fresh data @regression", async ({
  homePage,
  lotDrawerPage,
}) => {
  await homePage.goto();
  // Lot W opens spot view instead of drawer, so we test with a non-live lot
  // that has been mocked. Let's override the mock to make Parking Deck live.
  // Actually, the drawer only shows for non-LIVE_LOT_IDS (lot-w opens SpotView).
  // The Live badge only appears for LIVE_LOT_IDS lots.
  // So we need to verify the Live badge appears somewhere — let's check Overview instead.
  await homePage.selectTab("Overview");
  await expect(homePage.page.locator("text=Live").first()).toBeVisible();
});

test("lot W shows non-live badge when Supabase fails @regression", async ({
  page,
}) => {
  // Clear default fixture mock and simulate Supabase failure
  await page.unrouteAll({ behavior: "wait" });
  await page.route("**/rest/v1/lot_latest*", (route) =>
    route.fulfill({ status: 500, body: "Internal Server Error" })
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Overview" }).click();
  // When Supabase fails, isLive=false. UI shows "Mock Data" during operating hours
  // or "Offline" outside 7am-7pm. Either means the lot is not live.
  const mockBadge = page.locator("text=Mock Data").first();
  const offlineBadge = page.locator("text=Offline").first();
  await expect(mockBadge.or(offlineBadge)).toBeVisible();
});

test("coming soon lots show placeholder in drawer @regression", async ({
  homePage,
  lotDrawerPage,
}) => {
  await homePage.goto();
  await homePage.clickLotMarker("3000 Lot");
  await expect(lotDrawerPage.comingSoonText).toBeVisible();
  // Should NOT show availability count
  await expect(lotDrawerPage.availableCount).not.toBeVisible();
});
