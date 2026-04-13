import { type Page, type Locator } from "@playwright/test";

export class LotDrawerPage {
  readonly page: Page;
  readonly drawer: Locator;
  readonly backdrop: Locator;

  constructor(page: Page) {
    this.page = page;
    this.drawer = page.getByTestId("lot-drawer");
    this.backdrop = page.getByTestId("lot-drawer-backdrop");
  }

  get lotName(): Locator {
    return this.drawer.locator("h2");
  }

  get availableCount(): Locator {
    return this.drawer.locator("p.text-4xl");
  }

  get capacityText(): Locator {
    return this.drawer.locator("text=spots available out of");
  }

  get liveBadge(): Locator {
    return this.drawer.locator("text=Live").first();
  }

  get mockBadge(): Locator {
    return this.drawer.locator("text=Mock Data");
  }

  get offlineBadge(): Locator {
    return this.drawer.locator("text=Offline");
  }

  get comingSoonText(): Locator {
    return this.drawer.locator("text=Real-time availability coming soon.");
  }

  get directionsLink(): Locator {
    return this.drawer.locator("a", { hasText: "Directions" });
  }

  get lastUpdatedText(): Locator {
    return this.drawer.locator("text=Last updated:");
  }

  get operatingHoursNote(): Locator {
    return this.drawer.locator("text=Live data available 7 AM – 7 PM");
  }

  async close() {
    await this.backdrop.click({ position: { x: 10, y: 10 } });
  }
}
