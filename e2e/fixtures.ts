import { test as base, expect } from "@playwright/test";
import { HomePage } from "./pages/home.page";
import { LotDrawerPage } from "./pages/lot-drawer.page";
import { OverviewPage } from "./pages/overview.page";

/** Default mock response for the Supabase lot_latest table. */
const DEFAULT_LOT_LATEST = [
  {
    lot_id: "W",
    occupied: 12,
    timestamp: new Date().toISOString(),
    occupied_ids: [1, 3, 5, 7, 9, 11, 14, 16, 18, 20, 22, 24],
    reason: "change",
  },
];

type Fixtures = {
  homePage: HomePage;
  lotDrawerPage: LotDrawerPage;
  overviewPage: OverviewPage;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    // Mock Supabase REST API by default
    await page.route("**/rest/v1/lot_latest*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(DEFAULT_LOT_LATEST),
      })
    );
    await use(new HomePage(page));
  },

  lotDrawerPage: async ({ page }, use) => {
    await use(new LotDrawerPage(page));
  },

  overviewPage: async ({ page }, use) => {
    await use(new OverviewPage(page));
  },
});

export { expect };
