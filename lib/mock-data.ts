import { LotStatus, ParkingSpot, SpotType } from "@/types/parking";

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

/**
 * Returns hardcoded individual spot statuses for local development.
 * Only Lot W has Pi/camera coverage; all other lots return an empty array.
 *
 * @param lotId - The lot identifier to look up
 * @returns Array of {@link ParkingSpot} statuses, or `[]` if no spot data exists
 */
export function getMockLotSpots(lotId: string): ParkingSpot[] {
  if (lotId !== "lot-w") return [];

  // 80 total: A×20, BL×20, BR×20, C×20 (C1–C8 ADA)
  // BL/BR = placeholder IDs for double-sided center island (real IDs arrive with Pi data)
  // [id, occupied, type?] — type defaults to "standard" if omitted
  const pattern: [string, boolean, SpotType?][] = [
    // Col A (20 spots)
    ["A1",  false], ["A2",  true],  ["A3",  false], ["A4",  false],
    ["A5",  true],  ["A6",  false], ["A7",  true],  ["A8",  false],
    ["A9",  false], ["A10", true],  ["A11", false], ["A12", true],
    ["A13", false], ["A14", false], ["A15", true],  ["A16", false],
    ["A17", true],  ["A18", false], ["A19", true],  ["A20", false],
    // Col BL — left face of center island (20 spots)
    ["BL1",  true],  ["BL2",  true],  ["BL3",  false], ["BL4",  false],
    ["BL5",  false], ["BL6",  true],  ["BL7",  false], ["BL8",  true],
    ["BL9",  false], ["BL10", false], ["BL11", true],  ["BL12", false],
    ["BL13", true],  ["BL14", false], ["BL15", false], ["BL16", true],
    ["BL17", false], ["BL18", true],  ["BL19", false], ["BL20", true],
    // Col BR — right face of center island (20 spots)
    ["BR1",  false], ["BR2",  true],  ["BR3",  false], ["BR4",  true],
    ["BR5",  false], ["BR6",  true],  ["BR7",  false], ["BR8",  false],
    ["BR9",  true],  ["BR10", false], ["BR11", true],  ["BR12", false],
    ["BR13", false], ["BR14", true],  ["BR15", false], ["BR16", false],
    ["BR17", true],  ["BR18", false], ["BR19", true],  ["BR20", false],
    // Col C (C1–C8 ADA nearest entrance, C9–C20 regular)
    ["C1",  false, "handicap"], ["C2",  true,  "handicap"], ["C3",  false, "handicap"], ["C4",  true,  "handicap"],
    ["C5",  false, "handicap"], ["C6",  true,  "handicap"], ["C7",  false, "handicap"], ["C8",  true,  "handicap"],
    ["C9",  false], ["C10", false], ["C11", true],  ["C12", false],
    ["C13", false], ["C14", true],  ["C15", false], ["C16", true],
    ["C17", false], ["C18", true],  ["C19", false], ["C20", false],
  ];

  return pattern.map(([id, occupied, type]) => ({
    id,
    occupied,
    type: type ?? ("standard" as SpotType),
  }));
}
