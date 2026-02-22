import { getMockTrends } from "@/lib/mock-trends";

describe("getMockTrends", () => {
  it("returns 16 hourly data points", () => {
    expect(getMockTrends("lot-w")).toHaveLength(16);
  });

  it("starts at hour 6 and ends at hour 21", () => {
    const trends = getMockTrends("lot-w");
    expect(trends[0].hour).toBe(6);
    expect(trends[15].hour).toBe(21);
  });

  it("has sequential hours", () => {
    const trends = getMockTrends("lot-w");
    trends.forEach((t, i) => expect(t.hour).toBe(i + 6));
  });

  it("keeps occupancy between 0 and 1", () => {
    const trends = getMockTrends("lot-w");
    trends.forEach((t) => {
      expect(t.avgOccupancy).toBeGreaterThanOrEqual(0);
      expect(t.avgOccupancy).toBeLessThanOrEqual(1);
    });
  });

  it("applies per-lot variance", () => {
    const base = getMockTrends("lot-w");
    const lower = getMockTrends("lot-3000"); // -0.1 variance
    // At peak (index 5, 0.92 base), lot-3000 should be lower
    expect(lower[5].avgOccupancy).toBeLessThan(base[5].avgOccupancy);
  });

  it("clamps negative occupancy to 0", () => {
    // lot-3000 has -0.1 variance, base[0] = 0.05, so 0.05-0.1 = -0.05 → clamped to 0
    const trends = getMockTrends("lot-3000");
    expect(trends[0].avgOccupancy).toBe(0);
  });

  it("handles unknown lot with 0 variance", () => {
    const trends = getMockTrends("unknown");
    expect(trends).toHaveLength(16);
    expect(trends[0].avgOccupancy).toBe(0.05); // base pattern unchanged
  });
});
