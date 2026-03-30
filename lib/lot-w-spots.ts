import { ParkingSpot, SpotType } from "@/types/parking";

/**
 * Returns the real physical layout of Lot W as {@link ParkingSpot} objects.
 *
 * This represents the actual arrangement of spots in Lot W — 86 total:
 *   - Col A  (A1–A23):   10 visitor, 13 staff
 *   - Col BL (BL1–BL20): 20 staff (left face of center island)
 *   - Col BR (BR1–BR20): 20 staff (right face of center island)
 *   - Col C  (C1–C23):   8 reserved/handicap/access aisle, 7 staff
 *
 * Occupied values are placeholder (false) until connected to per-spot Supabase data.
 */
export function getLotWSpots(): ParkingSpot[] {
  // [id, occupied, type?] — type defaults to "standard" if omitted
  const layout: [string, boolean, SpotType?][] = [
    // Col A (23 spots)
    ["A1", false, "visitor"],
    ["A2", false, "visitor"],
    ["A3", false, "visitor"],
    ["A4", false, "visitor"],
    ["A5", false, "visitor"],
    ["A6", false, "visitor"],
    ["A7", false, "visitor"],
    ["A8", false, "visitor"],
    ["A9", false, "visitor"],
    ["A10", false, "visitor"],
    ["A11", false, "staff"],
    ["A12", false, "staff"],
    ["A13", false, "staff"],
    ["A14", false, "staff"],
    ["A15", false, "staff"],
    ["A16", false, "staff"],
    ["A17", false, "staff"],
    ["A18", false, "staff"],
    ["A19", false, "staff"],
    ["A20", false, "staff"],
    ["A21", false, "staff"],
    ["A22", false, "staff"],
    ["A23", false, "staff"],

    // Col BL — left face of center island (20 spots)
    ["BL1", false, "staff"],
    ["BL2", false, "staff"],
    ["BL3", false, "staff"],
    ["BL4", false, "staff"],
    ["BL5", false, "staff"],
    ["BL6", false, "staff"],
    ["BL7", false, "staff"],
    ["BL8", false, "staff"],
    ["BL9", false, "staff"],
    ["BL10", false, "staff"],
    ["BL11", false, "staff"],
    ["BL12", false, "staff"],
    ["BL13", false, "staff"],
    ["BL14", false, "staff"],
    ["BL15", false, "staff"],
    ["BL16", false, "staff"],
    ["BL17", false, "staff"],
    ["BL18", false, "staff"],
    ["BL19", false, "staff"],
    ["BL20", false, "staff"],

    // Col BR — right face of center island (20 spots)
    ["BR1", false, "staff"],
    ["BR2", false, "staff"],
    ["BR3", false, "staff"],
    ["BR4", false, "staff"],
    ["BR5", false, "staff"],
    ["BR6", false, "staff"],
    ["BR7", false, "staff"],
    ["BR8", false, "staff"],
    ["BR9", false, "staff"],
    ["BR10", false, "staff"],
    ["BR11", false, "staff"],
    ["BR12", false, "staff"],
    ["BR13", false, "staff"],
    ["BR14", false, "staff"],
    ["BR15", false, "staff"],
    ["BR16", false, "staff"],
    ["BR17", false, "staff"],
    ["BR18", false, "staff"],
    ["BR19", false, "staff"],
    ["BR20", false, "staff"],

    // Col C — C1–C16 reserved/handicap/access aisle, C17–C23 staff (23 spots)
    ["C1", false, "reserved"],
    ["C2", false, "reserved"],
    ["C3", false, "reserved"],
    ["C4", false, "handicap"],
    ["C5", false, "handicap"],
    ["C6", false, "access aisle"],
    ["C7", false, "handicap"],
    ["C8", false, "access aisle"],
    ["C9", false, "handicap"],
    ["C10", false, "access aisle"],
    ["C11", false, "handicap"],
    ["C12", false, "access aisle"],
    ["C13", false, "handicap"],
    ["C14", false, "access aisle"],
    ["C15", false, "handicap"],
    ["C16", false, "handicap"],
    ["C17", false, "staff"],
    ["C18", false, "staff"],
    ["C19", false, "staff"],
    ["C20", false, "staff"],
    ["C21", false, "staff"],
    ["C22", false, "staff"],
    ["C23", false, "staff"],
  ];

  return layout.map(([id, occupied, type]) => ({
    id,
    occupied,
    type: type ?? ("standard" as SpotType),
  }));
}
