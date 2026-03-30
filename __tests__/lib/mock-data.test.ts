import { getMockLotStatus } from "@/lib/mock-data";

describe("getMockLotStatus", () => {
  it("returns zeroed-out fallback for any lot", () => {
    const s = getMockLotStatus("lot-w");
    expect(s.lotId).toBe("lot-w");
    expect(s.carCount).toBe(0);
    expect(s.status).toBe("MOCK");
    expect(s.isLive).toBe(false);
  });

  it("returns zeroed-out fallback for unknown lot", () => {
    const s = getMockLotStatus("unknown");
    expect(s.lotId).toBe("unknown");
    expect(s.carCount).toBe(0);
    expect(s.status).toBe("MOCK");
    expect(s.isLive).toBe(false);
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
