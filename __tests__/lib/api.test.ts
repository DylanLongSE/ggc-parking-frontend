import { getLotStatus, getLotSpots } from "@/lib/api";
import { getMockLotStatus, getMockLotSpots } from "@/lib/mock-data";
import { LotStatus } from "@/types/parking";

const fakeSupabaseRow = {
  lot_id: "W",
  occupied: 12,
  timestamp: "2026-03-18T20:51:37Z",
};

const mockMaybeSingle = jest.fn();
const mockEq = jest.fn(() => ({ maybeSingle: mockMaybeSingle }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
const mockFrom = jest.fn(() => ({ select: mockSelect }));

jest.mock("@/lib/supabase", () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
  toSupabaseLotId: (id: string) => (id === "lot-w" ? "W" : id),
}));

jest.mock("@/lib/mock-data");
const mockGetMockLotStatus = getMockLotStatus as jest.MockedFunction<
  typeof getMockLotStatus
>;
const mockGetMockLotSpots = getMockLotSpots as jest.MockedFunction<
  typeof getMockLotSpots
>;

describe("getLotStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetMockLotStatus.mockReturnValue({
      lotId: "lot-w",
      carCount: 342,
      lastUpdated: new Date().toISOString(),
      status: "OK",
    });
  });

  it("returns Supabase data when query succeeds", async () => {
    mockMaybeSingle.mockResolvedValue({ data: fakeSupabaseRow, error: null });

    const result = await getLotStatus("lot-w");

    expect(mockFrom).toHaveBeenCalledWith("lot_latest");
    expect(mockSelect).toHaveBeenCalledWith("lot_id, occupied, timestamp");
    expect(mockEq).toHaveBeenCalledWith("lot_id", "W");
    expect(result).toEqual<LotStatus>({
      lotId: "lot-w",
      carCount: 12,
      lastUpdated: "2026-03-18T20:51:37Z",
      status: "OK",
    });
  });

  it("falls back to mock data when query returns an error", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: { message: "connection refused" },
    });

    const result = await getLotStatus("lot-w");

    expect(mockGetMockLotStatus).toHaveBeenCalledWith("lot-w");
    expect(result.carCount).toBe(342);
  });

  it("falls back to mock data when query returns no rows", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const result = await getLotStatus("lot-w");

    expect(mockGetMockLotStatus).toHaveBeenCalledWith("lot-w");
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
        carCount: 342,
        lastUpdated: new Date().toISOString(),
        status: "OK",
      })),
      getMockLotSpots: jest.fn(() => []),
    }));

    const { getLotStatus: getLotStatusFresh } = await import("@/lib/api");
    const result = await getLotStatusFresh("lot-w");

    expect(result.carCount).toBe(342);
  });
});

describe("getLotSpots", () => {
  it("returns mock data (spot-level data not in Supabase yet)", async () => {
    mockGetMockLotSpots.mockReturnValue([
      { id: "A1", occupied: true, type: "standard" },
    ]);

    const result = await getLotSpots("lot-w");

    expect(mockGetMockLotSpots).toHaveBeenCalledWith("lot-w");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("A1");
  });
});
