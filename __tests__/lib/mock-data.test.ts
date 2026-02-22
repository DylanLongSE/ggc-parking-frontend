import { getMockLotStatus } from "@/lib/mock-data";

describe("getMockLotStatus", () => {
  it("returns correct data for lot-w", () => {
    const s = getMockLotStatus("lot-w");
    expect(s.lotId).toBe("lot-w");
    expect(s.carCount).toBe(342);
    expect(s.status).toBe("OK");
  });

  it("returns correct data for parking-deck", () => {
    const s = getMockLotStatus("parking-deck");
    expect(s.carCount).toBe(780);
  });

  it("returns correct data for lot-a", () => {
    expect(getMockLotStatus("lot-a").carCount).toBe(250);
  });

  it("returns correct data for lot-l", () => {
    expect(getMockLotStatus("lot-l").carCount).toBe(340);
  });

  it("returns correct data for lot-3000", () => {
    expect(getMockLotStatus("lot-3000").carCount).toBe(120);
  });

  it("returns default fallback for unknown lot", () => {
    const s = getMockLotStatus("unknown");
    expect(s.lotId).toBe("unknown");
    expect(s.carCount).toBe(0);
    expect(s.status).toBe("OK");
  });

  it("generates fresh timestamp", () => {
    const before = Date.now();
    const s = getMockLotStatus("lot-w");
    const after = Date.now();
    const ts = new Date(s.lastUpdated).getTime();
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });
});
