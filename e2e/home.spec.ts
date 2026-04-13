import { test, expect } from "./fixtures";

test("home page loads with title @smoke", async ({ homePage }) => {
  await homePage.goto();
  await expect(homePage.page).toHaveTitle(/GGC Parking/i);
});

test("map container renders @smoke", async ({ homePage }) => {
  await homePage.goto();
  await expect(homePage.mapContainer).toBeVisible();
});

test("lot markers render on map @smoke", async ({ homePage }) => {
  await homePage.goto();
  const markers = homePage.page.locator(".leaflet-marker-icon");
  await expect(markers).toHaveCount(5);
});
