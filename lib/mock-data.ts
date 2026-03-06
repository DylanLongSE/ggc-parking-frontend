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

  return (
    mockData[lotId] ?? {
      lotId,
      carCount: 0,
      lastUpdated: new Date().toISOString(),
      status: "OK",
    }
  );
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

  // 86 total: A×23, BL×20, BR×20, C×23 (C1–C16 reserved/handicap/access aisle, C17–C23 staff)
  // BL/BR = placeholder IDs for double-sided center island (real IDs arrive with Pi data)
  // [id, occupied, type?] — type defaults to "standard" if omitted
  const pattern: [string, boolean, SpotType?][] = [
    // Col A (20 spots)
    ["A1", false, "visitor"],
    ["A2", true, "visitor"],
    ["A3", false, "visitor"],
    ["A4", false, "visitor"],
    ["A5", true, "visitor"],
    ["A6", false, "visitor"],
    ["A7", true, "visitor"],
    ["A8", false, "visitor"],
    ["A9", false, "visitor"],
    ["A10", true, "visitor"],
    ["A11", false, "staff"],
    ["A12", true, "staff"],
    ["A13", false, "staff"],
    ["A14", false, "staff"],
    ["A15", true, "staff"],
    ["A16", false, "staff"],
    ["A17", true, "staff"],
    ["A18", false, "staff"],
    ["A19", true, "staff"],
    ["A20", false, "staff"],
    ["A21", false, "staff"],
    ["A22", false, "staff"],
    ["A23", false, "staff"],

    // Col BL — left face of center island (20 spots)
    ["BL1", true, "staff"],
    ["BL2", true, "staff"],
    ["BL3", false, "staff"],
    ["BL4", false, "staff"],
    ["BL5", false, "staff"],
    ["BL6", true, "staff"],
    ["BL7", false, "staff"],
    ["BL8", true, "staff"],
    ["BL9", false, "staff"],
    ["BL10", false, "staff"],
    ["BL11", true, "staff"],
    ["BL12", false, "staff"],
    ["BL13", true, "staff"],
    ["BL14", false, "staff"],
    ["BL15", false, "staff"],
    ["BL16", true, "staff"],
    ["BL17", false, "staff"],
    ["BL18", true, "staff"],
    ["BL19", false, "staff"],
    ["BL20", true, "staff"],
    // Col BR — right face of center island (20 spots)
    ["BR1", false, "staff"],
    ["BR2", true, "staff"],
    ["BR3", false, "staff"],
    ["BR4", true, "staff"],
    ["BR5", false, "staff"],
    ["BR6", true, "staff"],
    ["BR7", false, "staff"],
    ["BR8", false, "staff"],
    ["BR9", true, "staff"],
    ["BR10", false, "staff"],
    ["BR11", true, "staff"],
    ["BR12", false, "staff"],
    ["BR13", false, "staff"],
    ["BR14", true, "staff"],
    ["BR15", false, "staff"],
    ["BR16", false, "staff"],
    ["BR17", true, "staff"],
    ["BR18", false, "staff"],
    ["BR19", true, "staff"],
    ["BR20", false, "staff"],
    // Col C (C1–C8 ADA nearest entrance, C9–C20 regular)
    ["C1", false, "reserved"],
    ["C2", true, "reserved"],
    ["C3", false, "reserved"],
    ["C4", true, "handicap"],
    ["C5", false, "handicap"],
    ["C6", true, "access aisle"],
    ["C7", false, "handicap"],
    ["C8", true, "access aisle"],
    ["C9", false, "handicap"],
    ["C10", false, "access aisle"],
    ["C11", true, "handicap"],
    ["C12", false, "access aisle"],
    ["C13", false, "handicap"],
    ["C14", true, "access aisle"],
    ["C15", false, "handicap"],
    ["C16", true, "handicap"],
    ["C17", false, "staff"],
    ["C18", true, "staff"],
    ["C19", false, "staff"],
    ["C20", false, "staff"],
    ["C21", false, "staff"],
    ["C22", false, "staff"],
    ["C23", false, "staff"],
  ];

  return pattern.map(([id, occupied, type]) => ({
    id,
    occupied,
    type: type ?? ("standard" as SpotType),
  }));
}
