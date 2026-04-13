import { type Page, type Locator } from "@playwright/test";

export class OverviewPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly totalSummary: Locator;
  readonly lotCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Parking Overview" });
    this.totalSummary = page.locator("text=/\\d+ of \\d+ total spots available/");
    // Lot cards are inside the grid container on the overview page
    this.lotCards = page.locator(".grid .rounded-xl.border");
  }

  getLotCard(lotName: string): Locator {
    return this.lotCards.filter({ hasText: lotName });
  }

  getComingSoonBadge(lotName: string): Locator {
    return this.getLotCard(lotName).locator("text=Coming Soon");
  }
}
