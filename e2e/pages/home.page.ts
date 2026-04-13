import { type Page, type Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly mapContainer: Locator;
  readonly tabBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mapContainer = page.locator(".leaflet-container");
    this.tabBar = page.locator("nav");
  }

  async goto() {
    await this.page.goto("/");
  }

  async selectTab(label: string) {
    await this.page.getByRole("button", { name: label }).click();
  }

  getTab(label: string): Locator {
    return this.page.getByRole("button", { name: label });
  }

  async clickLotMarker(lotName: string) {
    // Leaflet markers are divIcon divs with role="button" inside .leaflet-marker-pane
    // PARKING_LOTS order: lot-w(0), parking-deck(1), lot-a(2), lot-l(3), lot-3000(4)
    const lotIndex: Record<string, number> = {
      "Parking Lot W": 0,
      "Parking Deck": 1,
      "A Lot": 2,
      "L Lot": 3,
      "3000 Lot": 4,
    };
    const idx = lotIndex[lotName];
    if (idx === undefined) throw new Error(`Unknown lot: ${lotName}`);
    const marker = this.page.locator(".leaflet-marker-icon").nth(idx);
    await marker.waitFor({ state: "visible" });
    await marker.click();
  }
}
