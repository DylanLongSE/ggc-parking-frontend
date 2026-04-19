import { getLotStatus, getLotSpots, getLotHistory } from "@/lib/api";
import { getMockLotStatus } from "@/lib/mock-data";
import { LotStatus } from "@/types/parking";

const freshTimestamp = new Date().toISOString();
const fakeSupabaseRow = {
  lot_id: "W",
  occupied: 12,
  timestamp: freshTimestamp,
  occupied_ids: [0, 1, 2],
};

const mockMaybeSingle = jest.fn();
const mockEq = jest.fn(() => ({ maybeSingle: mockMaybeSingle }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
const mockFrom = jest.fn((_table: string) => ({ select: mockSelect }));
const mockRpc = jest.fn();

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: (table: string) => mockFrom(table),
    rpc: (...args: unknown[]) => mockRpc(...args),
  },
  toSupabaseLotId: (id: string) => (id === "lot-w" ? "W" : id),
}));

jest.mock("@/lib/mock-data");
const mockGetMockLotStatus = getMockLotStatus as jest.MockedFunction<
  typeof getMockLotStatus
>;

describe("getLotStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetMockLotStatus.mockReturnValue({
      lotId: "lot-w",
      carCount: 0,
      lastUpdated: new Date().toISOString(),
      status: "MOCK",
      isLive: false,
      occupiedIds: [],
    });
  });

  it("returns Supabase data with isLive=true when query succeeds", async () => {
    mockMaybeSingle.mockResolvedValue({ data: fakeSupabaseRow, error: null });

    const result = await getLotStatus("lot-w");

    expect(mockFrom).toHaveBeenCalledWith("lot_latest");
    expect(mockSelect).toHaveBeenCalledWith("lot_id, occupied, timestamp, occupied_ids");
    expect(mockEq).toHaveBeenCalledWith("lot_id", "W");
    expect(result).toEqual<LotStatus>({
      lotId: "lot-w",
      carCount: 3, // derived from occupiedIds.length, not lot_latest.occupied
      lastUpdated: freshTimestamp,
      status: "OK",
      isLive: true,
      occupiedIds: [0, 1, 2],
    });
  });

  it("falls back to mock data with isLive=false when query returns an error", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: { message: "connection refused" },
    });

    const result = await getLotStatus("lot-w");

    expect(mockGetMockLotStatus).toHaveBeenCalledWith("lot-w");
    expect(result.isLive).toBe(false);
  });

  it("falls back to mock data when query returns no rows", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const result = await getLotStatus("lot-w");

    expect(mockGetMockLotStatus).toHaveBeenCalledWith("lot-w");
    expect(result.isLive).toBe(false);
  });
});

describe("getLotStatus with null client", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("falls back to mock data when supabase client is null", async () => {
    jest.doMock("@/lib/supabase", () => ({
      supabase: null,
      toSupabaseLotId: (id: string) => id,
    }));
    jest.doMock("@/lib/mock-data", () => ({
      getMockLotStatus: jest.fn(() => ({
        lotId: "lot-w",
        carCount: 0,
        lastUpdated: new Date().toISOString(),
        status: "MOCK",
        isLive: false,
        occupiedIds: [],
      })),
    }));

    const { getLotStatus: getLotStatusFresh } = await import("@/lib/api");
    const result = await getLotStatusFresh("lot-w");

    expect(result.carCount).toBe(0);
    expect(result.isLive).toBe(false);
  });
});

describe("getLotHistory", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns mapped HourlyTrend array when RPC succeeds", async () => {
    mockRpc.mockResolvedValue({
      data: [
        { hour: 7,  avg_occupancy: 15.81, sample_count: 862 },
        { hour: 8,  avg_occupancy: 26.57, sample_count: 1793 },
      ],
      error: null,
    });

    const result = await getLotHistory("lot-w");

    expect(mockRpc).toHaveBeenCalledWith("get_hourly_averages", { p_lot_id: "W", p_days: 30 });
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ hour: 7, avgOccupancy: 15.81 });
    expect(result[1]).toEqual({ hour: 8, avgOccupancy: 26.57 });
  });

  it("returns empty array when RPC returns an error", async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: "RPC failed" } });
    const result = await getLotHistory("lot-w");
    expect(result).toEqual([]);
  });

  it("returns empty array when RPC returns no data", async () => {
    mockRpc.mockResolvedValue({ data: null, error: null });
    const result = await getLotHistory("lot-w");
    expect(result).toEqual([]);
  });
});

describe("getLotSpots", () => {
  it("returns real lot-w layout spots for lot-w", () => {
    const result = getLotSpots("lot-w");

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toBe("A1");
    expect(result[0].monitored).toBeDefined();
  });

  it("marks occupied spots based on Pi IDs", () => {
    const result = getLotSpots("lot-w", [0]); // Pi ID 0 = A1
    const a1 = result.find((s) => s.id === "A1");
    expect(a1?.occupied).toBe(true);
    expect(a1?.monitored).toBe(true);
  });

  it("returns empty array for lots without spot data", () => {
    const result = getLotSpots("lot-a");
    expect(result).toHaveLength(0);
  });
});
