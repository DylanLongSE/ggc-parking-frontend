import { LotStatus } from "@/types/parking";

export function getMockLotStatus(lotId: string): LotStatus {
  const mockData: Record<string, LotStatus> = {
    "lot-w": {
      lotId: "lot-w",
      occupiedSpaces: 342,
      lastUpdated: new Date().toISOString(),
    },
  };

  return mockData[lotId] ?? {
    lotId,
    occupiedSpaces: 0,
    lastUpdated: new Date().toISOString(),
  };
}
