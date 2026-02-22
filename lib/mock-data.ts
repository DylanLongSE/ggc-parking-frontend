import { LotStatus } from "@/types/parking";

/**
 * Returns a hardcoded {@link LotStatus} for local development and API fallback.
 * Unknown lot IDs receive a zeroed-out default entry.
 *
 * @param lotId - The lot identifier to look up
 * @returns Mock {@link LotStatus} with a fresh `lastUpdated` timestamp
 */
export function getMockLotStatus(lotId: string): LotStatus {
  const mockData: Record<string, LotStatus> = {
    "lot-w": {
      lotId: "lot-w",
      carCount: 342,
      lastUpdated: new Date().toISOString(),
      status: "OK",
    },
    "parking-deck": {
      lotId: "parking-deck",
      carCount: 780,
      lastUpdated: new Date().toISOString(),
      status: "OK",
    },
    "lot-a": {
      lotId: "lot-a",
      carCount: 250,
      lastUpdated: new Date().toISOString(),
      status: "OK",
    },
    "lot-l": {
      lotId: "lot-l",
      carCount: 340,
      lastUpdated: new Date().toISOString(),
      status: "OK",
    },
    "lot-3000": {
      lotId: "lot-3000",
      carCount: 120,
      lastUpdated: new Date().toISOString(),
      status: "OK",
    },
  };

  return mockData[lotId] ?? {
    lotId,
    carCount: 0,
    lastUpdated: new Date().toISOString(),
    status: "OK",
  };
}
